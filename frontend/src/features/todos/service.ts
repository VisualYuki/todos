import { todosApi } from './api'
import type { Todo } from './types'

export const todosService = {
  async add(
    title: string,
    description?: string,
    completed?: boolean
  ): Promise<Todo | undefined> {
    const res = await todosApi.add({ title, description, completed })
    return res?.todo
  },

  async remove(id: number): Promise<void> {
    await todosApi.delete(id)
  },

  async update(
    id: number,
    updates: { title?: string; description?: string; completed?: boolean }
  ): Promise<Todo | undefined> {
    const res = await todosApi.update({ id, ...updates })
    return res?.todo
  },

  async fetchAll(): Promise<Todo[] | undefined> {
    const res = await todosApi.all()
    if (res === undefined) return undefined
    return res.todos ?? []
  },
}
