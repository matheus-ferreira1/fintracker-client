<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import type { ApiResponse } from '~/types/api.types'
import type { User } from '~/types/user.types'

definePageMeta({
  middleware: 'auth'
})

const profileSchema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.email('Invalid email')
})

type ProfileSchema = z.output<typeof profileSchema>

const authStore = useAuthStore()
const toast = useToast()

const isLoading = ref(false)

const originalProfile = reactive<Partial<ProfileSchema>>({
  name: authStore.user?.name || '',
  email: authStore.user?.email || ''
})

const profile = reactive<Partial<ProfileSchema>>({
  name: authStore.user?.name || '',
  email: authStore.user?.email || ''
})

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser && !profile.name && !profile.email) {
      originalProfile.name = newUser.name
      originalProfile.email = newUser.email
      profile.name = newUser.name
      profile.email = newUser.email
    }
  },
  { immediate: true }
)

const isFormDirty = computed(() => {
  return (
    profile.name !== originalProfile.name
    || profile.email !== originalProfile.email
  )
})

async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
  const { $api } = useNuxtApp()
  isLoading.value = true

  try {
    const user = await $api<ApiResponse<User>>('/auth/profile', {
      method: 'PATCH',
      body: event.data
    })
    authStore.setUser(user.data)

    originalProfile.name = event.data.name
    originalProfile.email = event.data.email

    toast.add({
      title: 'Profile information updated successfully!'
    })
  } catch (err) {
    toast.add({
      title: 'Something went wrong',
      description: parseApiError(err),
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UForm
    :schema="profileSchema"
    :state="profile"
    @submit="onSubmit"
  >
    <UPageCard
      title="Profile"
      description="These informations will be displayed publicly."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        label="Save changes"
        color="neutral"
        type="submit"
        class="w-fit lg:ms-auto"
        :loading="isLoading"
        :disabled="!isFormDirty"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        name="name"
        label="Name"
        description="Will appear on receipts, invoices, and other communication."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.name"
          autocomplete="off"
        />
      </UFormField>

      <USeparator />

      <UFormField
        name="email"
        label="Email"
        description="Used to sign in, for email receipts and product updates."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="profile.email"
          type="email"
          autocomplete="off"
        />
      </UFormField>
    </UPageCard>
  </UForm>
</template>
