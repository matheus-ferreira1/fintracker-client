<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { CalendarDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

const schema = z.object({
  amount: z.number('Amount must be a number').gt(0, 'Amount must be greater than 0'),
  category: z.string('Please select a category').min(2, 'Too short'),
  description: z.string('Please enter a description').min(2, 'Too short'),
  date: z.custom<DateValue>((val) => {
    return val instanceof CalendarDate
      || (val && typeof val === 'object' && 'calendar' in val && 'year' in val && 'month' in val && 'day' in val)
  }, 'Please enter a valid date'),
  isRecurring: z.boolean()
})
const open = ref(false)

type Schema = z.output<typeof schema>

const getCurrentDate = () => {
  const now = new Date()
  return new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

const state = reactive({
  amount: undefined,
  category: undefined,
  description: undefined,
  date: getCurrentDate(),
  isRecurring: false
}) as {
  amount: number | undefined
  category: string | undefined
  description: string | undefined
  date: DateValue
  isRecurring: boolean
}

const incomeCategories = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Education'
]

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const formData = {
    ...event.data,
    date: event.data.date instanceof CalendarDate
      ? event.data.date.toDate('UTC')
      : new Date(event.data.date.year, event.data.date.month - 1, event.data.date.day)
  }

  toast.add({
    title: 'Success',
    description: `Income of $${event.data.amount} added for ${event.data.category}`,
    color: 'success'
  })

  console.log('Form data:', formData)

  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Add Expense"
    description="Enter the details of your expense."
  >
    <UButton
      label="Add Expenses"
      variant="subtle"
      icon="material-symbols:trending-down"
      :ui="{
        leadingIcon: 'text-red-400'
      }"
    />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        :validate-on="['blur']"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Amount"
          name="amount"
        >
          <UInput
            v-model="state.amount"
            placeholder="0.00"
            type="number"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Category"
          name="category"
        >
          <USelect
            v-model="state.category"
            placeholder="Select a Category"
            :items="incomeCategories"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Description"
          name="description"
        >
          <UInput
            v-model="state.description"
            placeholder="Enter description"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Date"
          name="date"
        >
          <UInputDate
            v-model="state.date"
            class="w-full"
          />
        </UFormField>

        <UFormField
          name="isRecurring"
        >
          <UCheckbox
            v-model="state.isRecurring"
            label="Monthly recurring transaction"
          />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            label="Create"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
