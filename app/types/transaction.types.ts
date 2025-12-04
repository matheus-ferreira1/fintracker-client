export interface Transaction {
  id: string
  userId: string
  categoryId: string
  categoryName: string
  categoryColor: string
  amount: number
  description: string
  date: Date
  period: string
  isRecurring: boolean
  createdAt: Date
  updatedAt: Date
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
}

export interface AvailablePeriod {
  year: number
  month: number
  transactionCount: number
}
