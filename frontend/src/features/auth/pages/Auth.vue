<template>
  <div class="flex items-center justify-center h-screen w-full">
    <div class="max-w-[400px] w-max">
      <div class="flex gap-2 mb-6">
        <Button
          label="Вход"
          :outlined="isRegistration"
          @click="isRegistration = false"
        />
        <Button
          label="Регистрация"
          :outlined="!isRegistration"
          @click="isRegistration = true"
        />
      </div>

      <FloatLabel class="mb-8">
        <label for="login">Login</label>
        <InputText v-model="login" placeholder="login" inputId="login" />
      </FloatLabel>

      <FloatLabel class="mb-4">
        <label for="password">Password</label>
        <Password v-model="password" :feedback="false" placeholder="password" inputId="password" />
      </FloatLabel>

      <p v-if="errorMessage" class="mb-4 text-red-600 text-sm">{{ errorMessage }}</p>

      <Button
        v-if="!isRegistration"
        label="Войти"
        class="w-full"
        @click="doLogin"
      />
      <Button
        v-else
        label="Зарегистрироваться"
        class="w-full"
        @click="doRegistration"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { InputText, Button, FloatLabel, Password } from 'primevue'
import { ref } from 'vue'
import { authService } from '../service'
import router from '@/core/router'

const login = ref('')
const password = ref('')
const isRegistration = ref(false)
const errorMessage = ref('')

async function doLogin() {
  errorMessage.value = ''
  const ok = await authService.login(login.value, password.value)
  if (ok) {
    router.push({ name: 'main' })
  } else {
    errorMessage.value = 'Неверный логин или пароль'
  }
}

async function doRegistration() {
  errorMessage.value = ''
  const ok = await authService.registration(login.value, password.value)
  if (ok) {
    router.push({ name: 'main' })
  } else {
    errorMessage.value = 'Ошибка регистрации. Проверьте данные или попробуйте другой логин.'
  }
}
</script>
