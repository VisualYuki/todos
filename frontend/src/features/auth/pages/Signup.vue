<template>
  <div class="flex items-center justify-center h-screen w-full">
    <div class="max-w-[400px] w-max">
      <ElForm labelPosition="top">
        <ElFormItem label="Login" :error="flattenErrors?.nested?.login?.[0]">
          <ElInput v-model="loginValue" />
        </ElFormItem>

        <ElFormItem label="Password" :error="flattenErrors?.nested?.password?.[0]">
          <ElInput v-model="passwordValue" type="password" />
        </ElFormItem>

        <ElFormItem label="Repeat password" :error="flattenErrors?.nested?.repeatedPassword?.[0]">
          <ElInput v-model="repeatedPasswordValue" type="password" />
        </ElFormItem>

        <br />

        <ElButton @click="doAuth" class="w-full"> sign up </ElButton>
        <ElButton @click="replace" class="w-full"> replace </ElButton>
      </ElForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElInput, ElForm, ElFormItem } from 'element-plus'
import { ref } from 'vue'
import * as v from 'valibot'

// const signupSchema = v.object({
//   'login': v.pipe(v.string(), v.nonEmpty(), v.minLength(4)),
//   'password': v.pipe(v.string(), v.nonEmpty())
// })

const pageSchema = v.pipe(
  v.object({
    login: v.pipe(v.string(), v.nonEmpty(), v.minLength(4), v.maxLength(30)),
    password: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.minLength(8),
      v.regex(/[A-Z]/, 'need at least one letter'),
    ),
    repeatedPassword: v.pipe(v.string(), v.nonEmpty()),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['repeatedPassword']],
      (input) => {
        return input.password === input.repeatedPassword
      },
      'The two passwords do not match.',
    ),
    ['repeatedPassword'],
  ),
)
const loginValue = ref('')
const passwordValue = ref('')
const repeatedPasswordValue = ref('')
const flattenErrors = ref<v.FlatErrors<typeof pageSchema>>()

async function doAuth() {
  const parseResult = v.safeParse(pageSchema, {
    login: loginValue.value,
    password: passwordValue.value,
    repeatedPassword: repeatedPasswordValue.value,
  })

  if (parseResult.success) {
  } else {
    flattenErrors.value = v.flatten(parseResult.issues)
  }

  // loginValidation.validate()
  // passwordValidation.validate()

  // if (!loginValidation.errorMessage.value && !passwordValidation.errorMessage.value) {
  //   const isLogin = await authService.signup(loginValue.value, passwordValue.value)

  //   if (isLogin) {
  //     router.push({ name: 'main' })
  //   }
  // }
}

function replace() {
  debugger

  window.history.replaceState({ some: 'some' }, '', window.location.href)
  window.history.go(0)
}
</script>
