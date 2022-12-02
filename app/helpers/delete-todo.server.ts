import { authenticator } from 'services/auth.server'
import invariant from 'tiny-invariant'
import { db } from './db'

export const deleteTodo = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request)
  invariant(user, 'You are not authenticated.')

  const formData = await request.formData()
  const id = Number(formData.get('id'))

  return await db.todo.delete({
    where: {
      id,
      authorId: user.id
    }
  })
}
