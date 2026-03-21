import { requestor } from '@/shared/api/requestor'
import type { Todo } from './types'

export const todosApi = {
  add(payload: { title: string; description?: string; completed?: boolean }) {
    return requestor.post<{ todo: Todo }>('/todos/add', payload)
  },

  delete(id: number) {
    return requestor.post<undefined>('/todos/delete', { id })
  },

  update(payload: {
    id: number
    title?: string
    description?: string
    completed?: boolean
  }) {
    return requestor.post<{ todo: Todo }>('/todos/update', payload)
  },

  all() {
    return requestor.post<{ todos: Todo[] }>('/todos/all', {})
  },
}
