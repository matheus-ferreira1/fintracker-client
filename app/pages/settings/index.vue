<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const profileSchema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.email('Invalid email')
})

type ProfileSchema = z.output<typeof profileSchema>

const authStore = useAuthStore()
const toast = useToast()

const profile = reactive<Partial<ProfileSchema>>({
  name: authStore.user?.name || '',
  email: authStore.user?.email || ''
})

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser && !profile.name && !profile.email) {
      profile.name = newUser.name
      profile.email = newUser.email
    }
  },
  { immediate: true }
)

async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
  if (authStore.user) {
    authStore.setUser({
      ...authStore.user,
      name: event.data.name,
      email: event.data.email
    })
  }

  toast.add({
    title: 'Success',
    description: 'Your settings have been updated.',
    icon: 'i-lucide-check',
    color: 'success'
  })
}
</script>

<template>
  <UForm
    id="settings"
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
        form="settings"
        label="Save changes"
        color="neutral"
        type="submit"
        class="w-fit lg:ms-auto"
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
