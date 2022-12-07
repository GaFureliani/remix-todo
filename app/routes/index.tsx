import type { Todo } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { createTodo } from 'helpers/create-todo.server'
import { deleteTodo } from 'helpers/delete-todo.server'
import { getTodos } from 'helpers/get-todos.server'
import { updateTodo } from 'helpers/update-todo.server'
import type { User } from 'services/auth.server'
import { authenticator } from 'services/auth.server'
import { useDebouncedSubmit } from 'hooks/useDebouncedSubmit'
import type { ChangeEvent } from 'react'
import { useCallback } from 'react'
import invariant from 'tiny-invariant'
type LoaderData = { user: User | null, todos: Todo[] | null }

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request)
  invariant(user, 'You are not authenticated.')

  const formData = await request.formData()
  const intent = formData.get('intent')
  switch (intent) {
    case 'create':
      return await createTodo(user.id)
    case 'update':
      return await updateTodo(formData, user.id)
    case 'delete':
      return await deleteTodo(formData, user.id)
    default:
      return new Response(undefined, { status: 400, statusText: 'Invalid intent.' })
  }
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const user = await authenticator.isAuthenticated(request)
  if (user === null) throw redirect('/login')
  const todos = await getTodos(user.id)
  return {
    user,
    todos
  }
}

export default function Index () {
  const data = useLoaderData<LoaderData>()
  const submit = useDebouncedSubmit()
  const onFormChange = useCallback((e: ChangeEvent<HTMLFormElement>) => {
    submit(e.currentTarget)
  }, [submit])
  if (data.user == null) return null
  return (
    <div className='p-5 min-w-[1270px]'>
      <div className='grid grid-cols-5 items-center justify-items-center font-semibold bg-gray-300  p-3'>
        <div>ID</div>
        <div>Done</div>
        <div>Description</div>
        <div>Target Date</div>
        <div className='flex justify-center'>
          <Form method='post'>
            <button name='intent' value='create' className='flex items-center bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition rounded-full text-white font-medium gap-2 px-4 py-2'>
              <svg className='w-7 h-7' viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              NEW
            </button>
          </Form>
        </div>
      </div>
      {data.todos?.map(todo => (
        <div key={todo.id} className='grid grid-cols-5 col-span-5 items-center justify-items-center my-1 bg-gray-100 hover:bg-gray-200 border p-3'>
          <div>{todo.id}</div>
          <Form method='post' className='grid grid-cols-3 col-span-3 items-center justify-items-center w-full' onChange={onFormChange}>
            <input type="hidden" name='id' value={todo.id} />
            <input type="hidden" name='intent' value='update' />
            <div>
              <input type="checkbox" name='isDone' defaultChecked={todo.isDone} className='w-5 h-5' />
            </div>
            <div className='w-full'>
              <input type="text" name='description' defaultValue={todo.description} className='w-full p-2 outline-none border border-gray-300 rounded-md' />
            </div>
            <div>
              <input type="date" name='targetDate' defaultValue={todo.targetDate.slice(0, 10)} className='p-2 outline-none border border-gray-300 rounded-md' />
            </div>
          </Form>
          <div className='flex justify-center'>
            <Form method='post'>
              <input type="hidden" name='id' value={todo.id} />
              <button name='intent' value='delete' className='border border-purple-500 hover:bg-purple-100 active:bg-purple-300 transition px-4 py-2 rounded-full flex items-center '>
                Delete
              </button>
            </Form>
          </div>
        </div>
      ))}
    </div>
  )
}
