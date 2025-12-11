import type { Category, CategoryType, Transaction } from '~~/prisma/generated/client'
import type { TransactionWhereInput } from '~~/prisma/generated/models'
import { prisma } from '../utils/prisma'

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

interface FindWithFiltersParams {
  startDate: Date
  endDate: Date
  categoryId?: string
  search?: string
  type?: CategoryType
}

interface PaginationParams {
  page: number
  limit: number
}

interface FindWithFiltersResult {
  transactions: (Transaction & { category: Category })[]
  totalItems: number
}

export const transactionRepository = {
  async create(userId: string, transactionData: CreateTransactionDTO): Promise<Transaction> {
    return prisma.transaction.create({
      data: {
        userId,
        ...transactionData,
        date: new Date(transactionData.date)
      }
    })
  },

  async findById(
    id: string,
    userId: string
  ): Promise<(Transaction & { category: Category }) | null> {
    return prisma.transaction.findUnique({
      where: { id, userId },
      include: {
        category: true
      }
    })
  },

  async update(
    id: string,
    userId: string,
    payload: UpdateTransactionDTO
  ): Promise<Transaction | null> {
    const { date, ...rest } = payload
    const updateData: Omit<UpdateTransactionDTO, 'date'> & { date?: Date } = {
      ...rest
    }

    if (date) {
      updateData.date = new Date(date)
    }

    return prisma.transaction.update({
      where: { id, userId },
      data: updateData
    })
  },

  async delete(id: string, userId: string): Promise<Transaction> {
    return prisma.transaction.delete({
      where: { id, userId }
    })
  },

  async getAvailablePeriods(userId: string): Promise<{ period: Date }[]> {
    return prisma.$queryRaw`
    SELECT DISTINCT DATE_TRUNC('month', t.date) AS period
    FROM "Transaction" t
    WHERE t."userId" = ${userId}
    ORDER BY period DESC
  `
  },

  async findWithFilters(
    userId: string,
    filters: FindWithFiltersParams,
    pagination: PaginationParams
  ): Promise<FindWithFiltersResult> {
    const { startDate, endDate, categoryId, search, type } = filters
    const { page, limit } = pagination

    const where: TransactionWhereInput = {
      userId,
      date: {
        gte: startDate,
        lte: endDate
      }
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive'
      }
    }

    if (type) {
      where.category = {
        type
      }
    }

    const skip = (page - 1) * limit

    const [transactions, totalItems] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: true
        },
        orderBy: {
          date: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.transaction.count({
        where
      })
    ])

    return {
      transactions,
      totalItems
    }
  },

  async getSumForFilters(userId: string, filters: FindWithFiltersParams): Promise<number> {
    const { startDate, endDate, categoryId, search, type } = filters

    const where: TransactionWhereInput = {
      userId,
      date: {
        gte: startDate,
        lte: endDate
      }
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive'
      }
    }

    if (type) {
      where.category = {
        type
      }
    }

    const result = await prisma.transaction.aggregate({
      where,
      _sum: {
        amount: true
      }
    })

    return Number(result._sum.amount) || 0
  }
}
