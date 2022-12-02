import { authenticator } from 'services/auth.server'
import invariant from 'tiny-invariant'
import { db } from './db'

export const createTodo = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request)
  invariant(user, 'You are not authenticated.')

  return await db.todo.create({
    data: {
      isDone: false,
      description: '',
      targetDate: new Date().toISOString(),
      author: {
        connect: {
          id: user.id
        }
      }
    }
  })
}
