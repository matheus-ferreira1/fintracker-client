<script setup lang="ts">
import { registerSchema } from '#shared/schemas/register'
import type { FormSubmitEvent } from '@nuxt/ui'
import type * as z from 'zod'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useSeoMeta({
  title: 'Sign up',
  description: 'Create an account to get started'
})

const { fetch: refreshSession } = useUserSession()

const fields = [
  {
    name: 'name',
    type: 'text' as const,
    label: 'Name',
    placeholder: 'Enter your name'
  },
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'Enter your email'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    placeholder: 'Enter your password'
  }
]

type Schema = z.output<typeof registerSchema>

const pending = shallowRef(false)

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const toast = useToast()
  const { $api } = useNuxtApp()
  pending.value = true
  try {
    await $api<ApiResponse<User>>('/api/auth/register', {
      method: 'POST',
      body: payload.data
    })
    await refreshSession()
    await navigateTo('/dashboard')
    toast.add({
      title: 'Welcome!'
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
    :schema="registerSchema"
    :loading="pending"
    title="Create an account"
    :submit="{ label: 'Create account' }"
    @submit="onSubmit"
  >
    <template #description>
      Already have an account?
      <ULink
        to="/login"
        class="text-primary font-medium"
      >Login</ULink>.
    </template>
  </UAuthForm>
</template>
