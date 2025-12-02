export type TransactionType = 'income' | 'expense'

export enum TransactionEnum {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface Transaction {
  id: string
  userId: string
  categoryId: string
  amount: number
  description: string
  date: Date
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

export interface AvailablePeriod {
  year: number
  month: number
  transactionCount: number
}
