<template>
  <div class="flex items-center justify-center h-screen w-full">
    <div class="max-w-[400px] w-max">
      <ElForm labelPosition="top">
        <ElFormItem label="Login">
          <ElInput v-model="login" />
        </ElFormItem>

        <ElFormItem label="Password">
          <ElInput v-model="password" type="password" placeholder="password" />
        </ElFormItem>

        <br />

        <ElButton @click="doAuth" class="w-full"> Log in </ElButton>
      </ElForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElInput, ElForm, ElFormItem } from 'element-plus'
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
