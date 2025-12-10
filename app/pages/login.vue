<script setup lang="ts">
import { loginSchema } from '#shared/schemas/login'
import type { FormSubmitEvent } from '@nuxt/ui'
import type * as z from 'zod'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue'
})

const { fetch: refreshSession } = useUserSession()

const fields = [
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    placeholder: 'Enter your password',
    required: true
  }
]

type Schema = z.output<typeof loginSchema>

const pending = shallowRef(false)

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const toast = useToast()
  const { $api } = useNuxtApp()
  pending.value = true
  try {
    await $api<ApiResponse<User>>('/api/auth/login', {
      method: 'POST',
      body: payload.data
    })
    await refreshSession()
    await navigateTo('/dashboard')
    toast.add({
      title: 'Welcome back!'
    })
  } catch (err) {
    toast.add({
      title: 'Something went wrong',
      description: parseApiError(err),
      color: 'error'
    })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="loginSchema"
    title="Welcome back"
    icon="i-lucide-lock"
    :loading="pending"
    @submit="onSubmit"
  >
    <template #description>
      Don't have an account?
      <ULink
        to="/register"
        class="text-primary font-medium"
      >Sign up</ULink>.
    </template>
  </UAuthForm>
</template>
