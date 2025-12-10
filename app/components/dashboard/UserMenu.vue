<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

defineProps<{
  collapsed?: boolean
}>()

const colorMode = useColorMode()

const { user, clear: clearSession } = useUserSession()

const userDisplay = computed(() => {
  if (!user.value) {
    return {
      name: '',
      avatar: {
        text: ''
      }
    }
  }

  return {
    name: user.value.name,
    avatar: {
      text: user.value.name
    }
  }
})

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      type: 'label',
      label: userDisplay.value.name,
      avatar: userDisplay.value.avatar
    }
  ],
  [
    {
      label: 'Appearance',
      icon: 'i-lucide-sun-moon',
      children: [
        {
          label: 'Light',
          icon: 'i-lucide-sun',
          type: 'checkbox',
          checked: colorMode.value === 'light',
          onSelect(e: Event) {
            e.preventDefault()

            colorMode.preference = 'light'
          }
        },
        {
          label: 'Dark',
          icon: 'i-lucide-moon',
          type: 'checkbox',
          checked: colorMode.value === 'dark',
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = 'dark'
            }
          },
          onSelect(e: Event) {
            e.preventDefault()
          }
        }
      ]
    }
  ],
  [
    {
      label: 'Log out',
      icon: 'i-lucide-log-out',
      type: 'link',
      onSelect: handleLogout
    }
  ]
])

const handleLogout = async () => {
  await clearSession()
  await navigateTo('/login')
}
</script>

<template>
  <!-- <div v-if="isLoading">
    <div
      v-if="collapsed"
      class="flex items-center justify-center p-2"
    >
      <USkeleton class="size-8 rounded-md" />
    </div>
    <div
      v-else
      class="flex items-center gap-2 px-2 py-1.5 rounded-md"
    >
      <USkeleton class="size-8 rounded-md shrink-0" />
      <div class="flex-1 flex items-center gap-2 min-w-0">
        <USkeleton class="h-4 w-24" />
        <USkeleton class="size-4 shrink-0 ml-auto" />
      </div>
    </div>
  </div> -->

  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{
      content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)'
    }"
  >
    <UButton
      v-bind="{
        ...userDisplay,
        label: collapsed ? undefined : userDisplay.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />

    <template #chip-leading="{ item }">
      <div class="inline-flex items-center justify-center shrink-0 size-5">
        <span
          class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
          :style="{
            '--chip-light': `var(--color-${(item as any).chip}-500)`,
            '--chip-dark': `var(--color-${(item as any).chip}-400)`
          }"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>
