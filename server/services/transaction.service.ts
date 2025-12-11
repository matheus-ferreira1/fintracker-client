import type { Category, CategoryType, Transaction } from '~~/prisma/generated/client'
import { categoryRepository } from '../repositories/category.repository'
import { transactionRepository } from '../repositories/transaction.repository'

interface CreateTransactionDTO {
  categoryId: string
  amount: number
  description: string
  date: string
  isRecurring: boolean
}

interface UpdateTransactionDTO {
  categoryId?: string
  amount?: number
  description?: string
  date?: string
  isRecurring?: boolean
}

interface TransactionFilters {
  period?: string
  categoryId?: string
  search?: string
  type?: CategoryType
  page?: number
  limit?: number
}

interface PaginationMetadata {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface GetTransactionsResponse {
  transactions: (Transaction & { category: Category })[]
  count: number
  sum: number
  pagination: PaginationMetadata
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const transactionService = {
  async createTransaction(
    userId: string,
    transactionData: CreateTransactionDTO
  ): Promise<Transaction> {
    const category = await categoryRepository.findById(transactionData.categoryId, userId)

    if (!category) {
      throw createError({
        statusCode: 404,
        message: 'Category not found'
      })
    }

    return await transactionRepository.create(userId, transactionData)
  },

  async getTransaction(
    userId: string,
    transactionId: string
  ): Promise<Transaction & { category: Category }> {
    const transaction = await transactionRepository.findById(transactionId, userId)

    if (!transaction) {
      throw createError({
        statusCode: 404,
        message: 'Transaction not found'
      })
    }

    return transaction
  },

  async getTransactions(
    userId: string,
    filters: TransactionFilters
  ): Promise<GetTransactionsResponse> {
    const page = filters.page || 1
    const limit = filters.limit || 10

    let month: number
    let year: number

    if (filters.period) {
      const periodRegex = /^(0[1-9]|1[0-2])\d{4}$/
      if (!periodRegex.test(filters.period)) {
        throw createError({
          statusCode: 400,
          message: 'Invalid period format. Expected format: MMYYYY (e.g., 012025)'
        })
      }

      month = Number.parseInt(filters.period.substring(0, 2), 10)
      year = Number.parseInt(filters.period.substring(2), 10)
    } else {
      const now = new Date()
      month = now.getUTCMonth() + 1
      year = now.getUTCFullYear()
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0))
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))

    const filterParams = {
      startDate,
      endDate,
      categoryId: filters.categoryId,
      search: filters.search,
      type: filters.type
    }

    const [result, sum] = await Promise.all([
      transactionRepository.findWithFilters(userId, filterParams, {
        page,
        limit
      }),
      transactionRepository.getSumForFilters(userId, filterParams)
    ])

    const { transactions, totalItems } = result

    const totalPages = Math.ceil(totalItems / limit)
    const pagination: PaginationMetadata = {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }

    return {
      transactions,
      count: totalItems,
      sum,
      pagination
    }
  },

  async updateTransaction(
    userId: string,
    transactionId: string,
    updates: UpdateTransactionDTO
  ): Promise<Transaction> {
    const existingTransaction = await this.getTransaction(userId, transactionId)

    if (updates.categoryId && updates.categoryId !== existingTransaction.categoryId) {
      const category = await categoryRepository.findById(updates.categoryId, userId)

      if (!category) {
        throw createError({
          statusCode: 404,
          message: 'Category not found'
        })
      }

      if (category.type !== existingTransaction.category.type) {
        throw createError({
          statusCode: 400,
          message: `Cannot change category to a different type. Current transaction is ${existingTransaction.category.type}.`
        })
      }
    }

    const updatedTransaction = await transactionRepository.update(transactionId, userId, updates)

    if (!updatedTransaction) {
      throw createError({
        statusCode: 404,
        message: 'Transaction not found or cannot be updated'
      })
    }

    return updatedTransaction
  },

  async deleteTransaction(userId: string, transactionId: string): Promise<boolean> {
    try {
      await transactionRepository.delete(transactionId, userId)
      return true
    } catch {
      throw createError({
        statusCode: 404,
        message: 'Transaction not found'
      })
    }
  },

  async getAvailablePeriods(userId: string): Promise<AvailablePeriod[]> {
    const results = await transactionRepository.getAvailablePeriods(userId)

    return results.map(({ period }) => {
      const year = period.getUTCFullYear()
      const month = period.getUTCMonth() + 1

      const value = `${String(month).padStart(2, '0')}${year}`

      return {
        value,
        year,
        month,
        label: `${monthNames[month - 1]} ${year}`
      }
    })
  }
}
