import { db } from './db'

export const deleteTodo = async (formData: FormData, authorId: number) => {
  const id = Number(formData.get('id'))

  return await db.todo.delete({
    where: {
      id,
      authorId
    }
  })
}
