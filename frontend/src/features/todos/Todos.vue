<template>
  <div class="py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Задачи</h1>
      <Button label="Выйти" severity="secondary" outlined @click="logout" />
    </div>

    <div class="mb-6 flex gap-2 flex-wrap">
      <InputText
        v-model="newTitle"
        placeholder="Название задачи"
        class="flex-1 min-w-[200px]"
        @keyup.enter="addTodo"
      />
      <InputText
        v-model="newDescription"
        placeholder="Описание (необязательно)"
        class="flex-1 min-w-[200px]"
        @keyup.enter="addTodo"
      />
      <Button label="Добавить" @click="addTodo" :loading="adding" />
    </div>

    <p v-if="errorMessage" class="mb-4 text-red-600 text-sm">{{ errorMessage }}</p>
    <p v-if="loading" class="text-gray-500">Загрузка...</p>

    <ul v-else class="space-y-3">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="flex items-start gap-3 p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <Checkbox
          :model-value="todo.completed"
          :binary="true"
          @update:model-value="(v: boolean) => toggleComplete(todo.id, v)"
        />
        <div class="flex-1 min-w-0">
          <template v-if="editingId === todo.id">
            <InputText
              v-model="editTitle"
              class="w-full mb-2"
              placeholder="Название"
              @keyup.enter="saveEdit(todo.id)"
            />
            <InputText
              v-model="editDescription"
              class="w-full mb-2"
              placeholder="Описание"
              @keyup.enter="saveEdit(todo.id)"
            />
            <div class="flex gap-2">
              <Button label="Сохранить" size="small" @click="saveEdit(todo.id)" />
              <Button label="Отмена" size="small" severity="secondary" outlined @click="cancelEdit" />
            </div>
          </template>
          <template v-else>
            <span
              class="block font-medium"
              :class="{ 'line-through text-gray-500': todo.completed }"
            >
              {{ todo.title }}
            </span>
            <span v-if="todo.description" class="block text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ todo.description }}
            </span>
            <span class="block text-xs text-gray-400 mt-1">
              {{ formatDate(todo.created_at) }}
            </span>
          </template>
        </div>
        <div v-if="editingId !== todo.id" class="flex gap-1 shrink-0">
          <Button
            label="Изменить"
            severity="secondary"
            size="small"
            outlined
            @click="startEdit(todo)"
          />
          <Button
            label="Удалить"
            severity="danger"
            size="small"
            outlined
            @click="removeTodo(todo.id)"
          />
        </div>
      </li>
    </ul>

    <p v-if="!loading && todos.length === 0" class="text-gray-500">Нет задач. Добавьте первую.</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Button, InputText, Checkbox } from 'primevue'
import { todosService } from './service'
import { authService } from '@/features/auth/service'
import router from '@/core/router'
import type { Todo } from './types'

const todos = ref<Todo[]>([])
const loading = ref(true)
const adding = ref(false)
const errorMessage = ref('')
const newTitle = ref('')
const newDescription = ref('')

const editingId = ref<number | null>(null)
const editTitle = ref('')
const editDescription = ref('')

onMounted(async () => {
  await loadTodos()
})

async function loadTodos() {
  loading.value = true
  errorMessage.value = ''
  const result = await todosService.fetchAll()
  if (result === undefined) {
    errorMessage.value = 'Не удалось загрузить задачи. Возможно, требуется войти снова.'
    todos.value = []
  } else {
    todos.value = result
  }
  loading.value = false
}

async function addTodo() {
  const title = newTitle.value.trim()
  if (!title) return
  adding.value = true
  errorMessage.value = ''
  const created = await todosService.add(title, newDescription.value.trim() || undefined)
  if (created) {
    todos.value = [created, ...todos.value]
    newTitle.value = ''
    newDescription.value = ''
  } else {
    errorMessage.value = 'Не удалось добавить задачу.'
  }
  adding.value = false
}

async function toggleComplete(id: number, completed: boolean) {
  const updated = await todosService.update(id, { completed })
  if (updated) {
    const i = todos.value.findIndex((t) => t.id === id)
    if (i !== -1) todos.value[i] = updated
  }
}

function startEdit(todo: Todo) {
  editingId.value = todo.id
  editTitle.value = todo.title
  editDescription.value = todo.description ?? ''
}

function cancelEdit() {
  editingId.value = null
  editTitle.value = ''
  editDescription.value = ''
}

async function saveEdit(id: number) {
  const title = editTitle.value.trim()
  if (!title) return
  const updated = await todosService.update(id, {
    title,
    description: editDescription.value.trim() || undefined,
  })
  if (updated) {
    const i = todos.value.findIndex((t) => t.id === id)
    if (i !== -1) todos.value[i] = updated
  }
  cancelEdit()
}

async function removeTodo(id: number) {
  await todosService.remove(id)
  todos.value = todos.value.filter((t) => t.id !== id)
}

function formatDate(created_at: string) {
  try {
    return new Date(created_at).toLocaleString()
  } catch {
    return created_at
  }
}

function logout() {
  authService.logout()
  router.push({ name: 'login' })
}
</script>
