import { db } from './db'
export const updateTodo = async (formData: FormData, authorId: number) => {
  const id = Number(formData.get('id'))
  const description = String(formData.get('description'))
  const isDone = Boolean(formData.get('isDone'))
  const targetDate = new Date(formData.get('targetDate') as string)
  console.log('id', id)
  console.log('description', description)
  console.log('isDone', isDone)
  console.log('targetDate', targetDate)
  return await db.todo.update({
    where: { id, authorId },
    data: {
      description,
      isDone,
      targetDate
    }
  })
}
