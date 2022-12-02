import { db } from './db'
import invariant from 'tiny-invariant'
import { authenticator } from 'services/auth.server'

export const getTodos = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request)
  invariant(user, 'You are not authenticated.')

  return await db.todo.findMany({ where: { authorId: user.id } })
}
