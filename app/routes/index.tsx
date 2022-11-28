import type { Todo } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { db } from '~/helpers/db'
import type { User } from '~/services/auth.server'
import { authenticator } from '~/services/auth.server'
import formatRelative from 'date-fns/formatRelative'

type LoaderData = { user: User | null, todos: Todo[] }

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const actionType = formData.get('actionType')
  if (actionType === 'createTodo') {
    const user = await authenticator.isAuthenticated(request)
    invariant(user, 'You are not authenticated.')
    const newTodo = await db.todo.create({
      data: {
        author: {
          connect: { id: user.id }
        },
        description: '',
        targetDate: new Date()
      }
    })
    return newTodo
  } else {
    return new Response()
  }
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const user = await authenticator.isAuthenticated(request)
  let todos: Todo[] = []
  if (user != null) {
    todos = await db.todo.findMany({
      where: {
        authorId: user.id
      }
    })
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
    <div className='flex flex-col items-center h-[calc(100vh-48px)]'>
      <table className='table-fixed'>
        <thead>
          <tr>
            <th className='px-12'>id</th>
            <th className='px-12'>done</th>
            <th className='px-12'>description</th>
            <th className='px-12'>target date</th>
          </tr>
        </thead>
        <tbody>
          {data.todos.map(t => (
            <tr key={t.id}>
              <td className='text-center'>{t.id}</td>
              <Form>
                <input type='checkbox' className='text-center' defaultChecked={t.isDone} />
                <input type='text' className='text-center' defaultValue={t.description} />
                <input type='datetime-locale' className='text-center' defaultValue={formatRelative(new Date(t.targetDate), Date.now())} />
              </Form>
            </tr>
          ))}
        </tbody>
      </table>
      <Form method='post'>
        <button name='actionType' value='createTodo' className='flex items-center gap-2 bg-blue-600 px-4 py-2 mt-4 rounded-full text-white'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create new todo
        </button>
      </Form>
    </div>
  )
}
