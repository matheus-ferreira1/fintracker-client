import type { Category } from './category.types'

export interface Transaction {
  id: string
  amount: number
  description: string
  isRecurring: boolean
  date: Date
  userId: string
  categoryId: string
  createdAt: Date
  updatedAt: Date
  category: Category
}

export interface GetTransactionsResponse {
  transactions: Transaction[]
  count: number
  sum: number
  pagination: Pagination
}

export interface CreateTransactionDTO {
  categoryId: string
  amount: number
  description: string
  date: string
  isRecurring: boolean
}

export interface UpdateTransactionDTO {
  categoryId?: string
  amount?: number
  description?: string
  date?: string
  isRecurring?: boolean
}

export interface TransactionFilters {
  period?: string
  categoryId?: string
  description?: string
  page: number
}

export interface AvailablePeriod {
  value: string
  year: number
  month: number
  label: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
