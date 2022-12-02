import { db } from './db'
import invariant from 'tiny-invariant'
import { authenticator } from 'services/auth.server'

export const updateTodo = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request)
  invariant(user, 'You are not authenticated.')

  const formData = await request.formData()
  const id = Number(formData.get('id'))
  const description = String(formData.get('description'))
  const isDone = Boolean(formData.get('isDone'))
  const targetDate = new Date(formData.get('targetDate') as string)

  return await db.todo.update({
    where: { id, authorId: user.id },
    data: {
      description,
      isDone,
      targetDate
    }
  })
}
