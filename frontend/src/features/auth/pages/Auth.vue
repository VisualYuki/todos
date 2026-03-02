<template>
  <div class="flex items-center justify-center h-screen w-full">
    <div class="max-w-[400px] w-max">
      <FloatLabel class="mb-8">
        <label for="login">Login</label>
        <InputText v-model="login" placeholder="login" inputId="login" />
      </FloatLabel>

      <FloatLabel class="mb-4">
        <label for="password">Password</label>
        <Password v-model="password" :feedback="false" placeholder="password" inputId="password" />
      </FloatLabel>

      <Button @click="doAuth" class="w-full"> auth </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { InputText, Button, FloatLabel, Password } from 'primevue'
import { ref } from 'vue'
import { authService } from '../service'
import router from '@/core/router'

const login = ref('moshkin-denis')
const password = ref('moshkin-denis')

async function doAuth() {
  const isLogin = await authService.login(login.value, password.value)

  if (isLogin) {
    router.push({ name: 'main' })
  }
}
</script>
