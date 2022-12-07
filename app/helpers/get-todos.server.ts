import { db } from './db'

export const getTodos = async (authorId: number) => {
  return await db.todo.findMany({ where: { authorId } })
}
