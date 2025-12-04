<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'
import type { ApiResponse } from '~/types/api.types'
import { CategoryType } from '~/types/category.types'
import type { AvailablePeriod, GetTransactionsResponse, Transaction, TransactionFilters } from '~/types/transaction.types'

definePageMeta({
  middleware: 'auth'
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()

const now = new Date()

const filters = reactive<TransactionFilters>({
  period: `${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`,
  categoryId: undefined,
  description: undefined
})

const query = computed(() => ({
  period: filters.period,
  categoryId: filters.categoryId,
  description: filters.description,
  type: CategoryType.EXPENSE
}))

const { data: expensesResponse, status: expensesStatus } = await useAPI<ApiResponse<GetTransactionsResponse>>(
  '/transactions', { query }
)

const expenses = computed(() => (expensesResponse.value?.data.transactions ?? []))

const totalAmountExpenses = computed(() => (expensesResponse.value?.data.sum ?? 0))

const expensesLength = computed(() => expensesResponse.value?.data.count)

const { data: periodsData } = await useAPI<ApiResponse<AvailablePeriod[]>>('/transactions/periods', { key: `${CategoryType.EXPENSE}-transactions` })

const periodOptions = computed(() => {
  const periods = periodsData.value?.data || []

  if (!periods.length) {
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const date = new Date(year, month - 1, 1)
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    return [{
      value: filters.period,
      label
    }]
  }

  return periods
})

const { fetchCategories } = useCategories(CategoryType.EXPENSE)
const { data: categoriesResponse } = await fetchCategories()
const categoriesData = computed(() => categoriesResponse.value?.data || [])

const categoryOptions = computed(() => {
  if (!categoriesData.value) return []
  return [
    { id: null, name: 'All Categories' },
    ...categoriesData.value.map(cat => ({ id: cat.id, name: cat.name }))
  ]
})

const selectedCategory = computed({
  get: () => {
    if (!filters.categoryId) return 'All Categories'
    const category = categoriesData.value?.find(cat => cat.id === filters.categoryId)
    return category?.name || 'All Categories'
  },
  set: (value: string) => {
    if (value === 'All Categories') {
      filters.categoryId = undefined
    } else {
      const category = categoriesData.value?.find(cat => cat.name === value)
      filters.categoryId = category?.id || undefined
    }
  }
})

const selectedPeriodLabel = computed({
  get: () => {
    const option = periodOptions.value.find(opt => opt.value === filters.period)
    return option?.label || periodOptions.value[0]?.label || ''
  },
  set: (label: string) => {
    const option = periodOptions.value.find(opt => opt.label === label)
    if (option) {
      filters.period = option.value
    }
  }
})

const columns: TableColumn<Transaction>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const dateValue = row.getValue('date')
      if (!dateValue) return '-'

      const date = new Date(dateValue as string)

      if (isNaN(date.getTime())) return 'Invalid Date'

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category
      const categoryColor = category.color
      const categoryName = category.name
      const isRecurring = row.original.isRecurring

      return h('div', { class: 'flex items-center gap-2' }, [
        h('div', {
          class: 'w-3 h-3 rounded-full',
          style: { backgroundColor: categoryColor }
        }),
        h('span', categoryName),
        isRecurring
          ? h(UBadge, { variant: 'subtle', color: 'primary', size: 'xs' }, () => 'Recurring')
          : null
      ])
    }
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)

      return h('div', { class: 'text-right font-medium text-red-600 dark:text-red-400' }, formatted)
    }
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, 'Actions'),
    cell: ({ row }) => {
      const items = [
        [{
          label: 'Edit',
          icon: 'i-lucide-pencil',
          onSelect: () => handleEdit(row.original)
        }],
        [{
          label: 'Delete',
          icon: 'i-lucide-trash-2',
          color: 'error' as const,
          onSelect: () => handleDelete(row.original)
        }]
      ]

      return h('div', { class: 'text-right' }, h(UDropdownMenu, {
        items,
        'aria-label': 'Actions dropdown'
      }, () => h(UButton, {
        'icon': 'i-lucide-ellipsis-vertical',
        'color': 'neutral',
        'variant': 'ghost',
        'size': 'xs',
        'aria-label': 'Row actions'
      })))
    }
  }
]

const { deleteTransation } = useTransactions(CategoryType.EXPENSE)

async function handleEdit(transaction: Transaction) {
  toast.add({
    title: 'Edit functionality',
    description: `Edit expense: ${transaction.description}`,
    color: 'info'
  })
  // todo
}

async function handleDelete(transaction: Transaction) {
  await deleteTransation(transaction.id)
}
</script>

<template>
  <UDashboardPanel id="expenses">
    <template #header>
      <UDashboardNavbar
        title="Expenses"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <TransactionsTransactionModal :type="CategoryType.EXPENSE" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <div class="flex items-center gap-3">
            <USelect
              v-model="selectedPeriodLabel"
              :items="periodOptions.map(opt => opt.label)"
              placeholder="Select Period"
              class="w-48"
            />

            <USelect
              v-model="selectedCategory"
              :items="categoryOptions.map(cat => cat.name)"
              placeholder="All Categories"
              class="w-48"
            />

            <UInput
              v-model="filters.description"
              icon="i-lucide-search"
              placeholder="Search expenses..."
              class="w-64"
            />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col h-full">
        <div class="border-b border-default px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted">
                Total Expenses for {{ selectedPeriodLabel }}
              </p>
              <p class="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmountExpenses) }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-muted">
                Transactions
              </p>
              <p class="text-2xl font-semibold mt-1">
                {{ expensesLength }}
              </p>
            </div>
          </div>
        </div>

        <!-- Expenses Table -->
        <div class="flex-1 overflow-hidden">
          <UTable
            :data="expenses"
            :columns="columns"
            :loading="expensesStatus === 'pending'"
            :empty="filters.description || filters.categoryId ? 'No expenses found matching your filters.' : 'No expenses for this period.'"
            sticky
            class="h-full"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
