<script setup lang="ts">
defineProps<{
  category: Category | undefined
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const open = ref(false)

async function onSubmit() {
  emit('confirm')
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Delete the category ${category?.name}?`"
    :description="`Are you sure? This action cannot be undone.`"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
