import type { Todo } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { createTodo } from 'helpers/create-todo.server'
import { deleteTodo } from 'helpers/delete-todo.server'
import { getTodos } from 'helpers/get-todos.server'
import { updateTodo } from 'helpers/update-todo.server'
import type { User } from 'services/auth.server'
import { authenticator } from 'services/auth.server'

type LoaderData = { user: User | null, todos: Todo[] | null }

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const intent = formData.get('intent')

  switch (intent) {
    case 'create':
      return await createTodo(request)
    case 'update':
      return await updateTodo(request)
    case 'delete':
      return await deleteTodo(request)
    default:
      return null
  }
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const user = await authenticator.isAuthenticated(request)
  let todos: Todo[] | null = null
  if (user != null) {
    todos = await getTodos(request)
  }

  return {
    user,
    todos
  }
}

export default function Index () {
  const data = useLoaderData<LoaderData>()
  if (data.user == null) {
    return (
      <h1>
        Hello Guest
      </h1>
    )
  }
  return (

    <Form method='post'>
      <button type='submit' name='intent' value='create' className='flex items-center gap-2 bg-blue-600 px-4 py-2 mt-4 rounded-full text-white'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create new todo
      </button>
    </Form>
  )
}
