<script setup lang="ts">
import type { Transaction } from '~~/shared/types/transaction.types';

const props = defineProps<{
  transaction?: Transaction
}>()

const emit = defineEmits<{
  submit: [transactionId: string]
}>()

const open = defineModel<boolean>('open', { default: false })

async function onSubmit() {
  if (props.transaction) emit('submit', props.transaction.id)
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Delete the transaction?"
    description="Are you sure? This action cannot be undone."
  >
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
