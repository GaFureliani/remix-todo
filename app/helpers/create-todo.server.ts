import { db } from './db'

export const createTodo = async (authorId: number) => {
  return await db.todo.create({
    data: {
      isDone: false,
      description: '',
      targetDate: new Date().toISOString(),
      author: {
        connect: {
          id: authorId
        }
      }
    }
  })
}
