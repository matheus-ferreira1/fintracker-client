<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'
import type { ApiResponse } from '~/types/api.types'
import { CategoryType } from '~/types/category.types'
import type { AvailablePeriod, GetTransactionsResponse, Transaction, TransactionFilters } from '~/types/transaction.types'

interface Props {
  type: CategoryType
}

const props = defineProps<Props>()

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const now = new Date()

const isDeleteModalOpen = shallowRef(false)
const isEditModalOpen = shallowRef(false)
const selectedTransaction = ref<Transaction | undefined>()

const filters = reactive<TransactionFilters>({
  period: `${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`,
  categoryId: undefined,
  description: undefined,
  page: 1
})

const query = computed(() => ({
  period: filters.period,
  categoryId: filters.categoryId,
  description: filters.description,
  page: filters.page,
  type: props.type
}))

const { data: transactionsResponse, status: transactionsStatus } = await useAPI<ApiResponse<GetTransactionsResponse>>(
  '/transactions', { query, key: `${props.type}-transactions`, cache: 'default' }
)

const transactions = computed(() => (transactionsResponse.value?.data.transactions ?? []))
const totalAmount = computed(() => (transactionsResponse.value?.data.sum ?? 0))
const transactionsLength = computed(() => transactionsResponse.value?.data.count)
const paginationData = computed(() => transactionsResponse.value?.data.pagination)

const { data: periodsData } = await useAPI<ApiResponse<AvailablePeriod[]>>('/transactions/periods', { key: `${props.type}-transactions-periods` })

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

const { fetchCategories } = useCategories(props.type)
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

const colorClass = computed(() => {
  return props.type === CategoryType.EXPENSE
    ? 'text-red-600 dark:text-red-400'
    : 'text-green-600 dark:text-green-400'
})

const typeLabel = computed(() => {
  return props.type === CategoryType.EXPENSE ? 'Expenses' : 'Income'
})

const typeLabelSingular = computed(() => {
  return props.type === CategoryType.EXPENSE ? 'expense' : 'income'
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
        year: 'numeric',
        timeZone: 'UTC'
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

      return h('div', { class: `text-right font-medium ${colorClass.value}` }, formatted)
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
          onSelect: () => handleDeleteRequest(row.original)
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

const { deleteTransation } = useTransactions(props.type)

function handleEdit(transaction: Transaction) {
  selectedTransaction.value = transaction
  isEditModalOpen.value = true
}

function handleDeleteRequest(transaction: Transaction) {
  selectedTransaction.value = transaction
  isDeleteModalOpen.value = true
}

async function handleDelete(transactionId: string) {
  await deleteTransation(transactionId)
  isDeleteModalOpen.value = false
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-3 pb-5 border-b border-default">
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
        :placeholder="`Search ${typeLabelSingular}...`"
        class="w-64"
      />
    </div>

    <div class="border-b border-default px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted">
            Total {{ typeLabel }} for {{ selectedPeriodLabel }}
          </p>
          <p
            class="text-3xl font-bold mt-1"
            :class="colorClass"
          >
            {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount) }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-muted">
            Transactions
          </p>
          <p class="text-2xl font-semibold mt-1">
            {{ transactionsLength }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <UTable
        :data="transactions"
        :columns="columns"
        :loading="transactionsStatus === 'pending'"
        :empty="filters.description || filters.categoryId ? `No ${typeLabelSingular} found matching your filters.` : `No ${typeLabelSingular} for this period.`"
        sticky
        class="h-full"
      />
    </div>

    <div class="mx-auto mt-10">
      <UPagination
        v-model:page="filters.page"
        :disabled="transactionsStatus === 'pending'"
        :items-per-page="paginationData?.itemsPerPage ?? 10"
        :total="paginationData?.totalItems"
      />
    </div>

    <TransactionsDeleteModal
      v-model:open="isDeleteModalOpen"
      :transaction="selectedTransaction"
      @submit="handleDelete"
    />

    <TransactionsTransactionModal
      v-model:open="isEditModalOpen"
      :type="type"
      :transaction="selectedTransaction"
    />
  </div>
</template>
