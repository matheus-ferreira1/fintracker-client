<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import type { Category } from '~/types/category.types'
import { type CreateTransactionDTO, TransactionEnum, type TransactionType } from '~/types/transaction.types'

interface Props {
  type: TransactionType
}

const props = defineProps<Props>()

const schema = z.object({
  amount: z.number('Amount must be a number').gt(0, 'Amount must be greater than 0'),
  categoryId: z.string('Please select a category').min(2, 'Too short'),
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
  categoryId: undefined,
  description: '',
  date: getCurrentDate(),
  isRecurring: false
}) as {
  amount: number | undefined
  categoryId: string | undefined
  description: string
  date: DateValue
  isRecurring: boolean
}

const isExpense = computed(() => props.type === 'expense')

const modalConfig = computed(() => ({
  title: isExpense.value ? 'Add Expense' : 'Add Income',
  description: isExpense.value
    ? 'Enter the details of your expense.'
    : 'Enter the details of your income.',
  buttonLabel: isExpense.value ? 'Add Expenses' : 'Add Income',
  buttonIcon: isExpense.value
    ? 'material-symbols:trending-down'
    : 'material-symbols:trending-up',
  iconColor: isExpense.value ? 'text-red-400' : 'text-green-400'
}))

const { data: categories, pending } = await useAPI(`/categories?type=${props.type}`, {
  key: `${props.type}-categories`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (data: any) => {
    return data?.data?.map((cat: Category) => ({
      label: cat.name,
      value: cat.id
    }))
  }
})

const transactionType = isExpense.value ? TransactionEnum.EXPENSE : TransactionEnum.INCOME
const { createTransation, loading } = useTransactions(transactionType)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const dateValue = event.data.date instanceof CalendarDate
    ? event.data.date.toDate('UTC')
    : new Date(event.data.date.year, event.data.date.month - 1, event.data.date.day)

  const payload: CreateTransactionDTO = {
    amount: event.data.amount,
    categoryId: event.data.categoryId,
    description: event.data.description,
    date: dateValue.toISOString(),
    isRecurring: event.data.isRecurring
  }

  await createTransation(payload)

  if (!loading.value) {
    open.value = false

    state.amount = undefined
    state.categoryId = undefined
    state.description = ''
    state.date = getCurrentDate()
    state.isRecurring = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="modalConfig.title"
    :description="modalConfig.description"
  >
    <UButton
      :label="modalConfig.buttonLabel"
      variant="subtle"
      :icon="modalConfig.buttonIcon"
      :ui="{
        leadingIcon: modalConfig.iconColor
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
          name="categoryId"
        >
          <USelect
            v-model="state.categoryId"
            :loading="pending"
            placeholder="Select a Category"
            :items="categories || []"
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
            :loading="loading"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
