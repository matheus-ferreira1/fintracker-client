import { CategoryType } from '~~/prisma/generated/enums'
import type {
  CategoryAggregation,
  MonthlyAggregation,
  PeriodSummary,
  RecurringTransactionsSummary
} from '../types/dashboard.types'
import { prisma } from '../utils/prisma'

export const dashboardRepository = {
  async getPeriodSummary(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PeriodSummary> {
    const results = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        amount: true
      }
    })

    const categoryIds = results.map(r => r.categoryId)
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds
        }
      },
      select: {
        id: true,
        type: true
      }
    })

    const categoryTypeMap = new Map(categories.map(c => [c.id, c.type]))

    let totalIncome = 0
    let totalExpenses = 0

    for (const result of results) {
      const amount = Number(result._sum.amount) || 0
      const categoryType = categoryTypeMap.get(result.categoryId)

      if (categoryType === CategoryType.income) {
        totalIncome += amount
      } else if (categoryType === CategoryType.expense) {
        totalExpenses += amount
      }
    }

    return {
      totalIncome,
      totalExpenses
    }
  },

  async getMonthlyAggregations(
    userId: string,
    monthsCount: number = 6
  ): Promise<MonthlyAggregation[]> {
    const now = new Date()
    const currentYear = now.getUTCFullYear()
    const currentMonth = now.getUTCMonth()

    const endDate = new Date(Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59, 999))
    const startYear = currentMonth >= monthsCount - 1 ? currentYear : currentYear - 1
    const startMonth = currentMonth >= monthsCount - 1 ? currentMonth - (monthsCount - 1) : 12 - (monthsCount - 1 - currentMonth)
    const startDate = new Date(Date.UTC(startYear, startMonth, 1, 0, 0, 0, 0))

    const results: Array<{
      month: Date
      categoryType: CategoryType
      total: number
    }> = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', t.date AT TIME ZONE 'UTC') AS month,
        c.type AS "categoryType",
        COALESCE(SUM(t.amount), 0) AS total
      FROM "Transaction" t
      INNER JOIN "Category" c ON t."categoryId" = c.id
      WHERE t."userId" = ${userId}
        AND t.date >= ${startDate}
        AND t.date <= ${endDate}
      GROUP BY DATE_TRUNC('month', t.date AT TIME ZONE 'UTC'), c.type
      ORDER BY month ASC
    `

    const monthlyMap = new Map<string, MonthlyAggregation>()

    for (let i = 0; i < monthsCount; i++) {
      const monthOffset = monthsCount - 1 - i
      const targetYear = currentMonth >= monthOffset ? currentYear : currentYear - 1
      const targetMonth = currentMonth >= monthOffset ? currentMonth - monthOffset : 12 - (monthOffset - currentMonth)
      const date = new Date(Date.UTC(targetYear, targetMonth, 1, 0, 0, 0, 0))

      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`
      monthlyMap.set(key, {
        month: date,
        income: 0,
        expenses: 0
      })
    }

    for (const result of results) {
      const monthDate = new Date(result.month)
      const key = `${monthDate.getUTCFullYear()}-${monthDate.getUTCMonth()}`
      const entry = monthlyMap.get(key)

      if (entry) {
        const amount = Number(result.total)
        if (result.categoryType === CategoryType.income) {
          entry.income = amount
        } else if (result.categoryType === CategoryType.expense) {
          entry.expenses = amount
        }
      }
    }

    return Array.from(monthlyMap.values())
  },

  async getExpensesByCategory(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<CategoryAggregation[]> {
    const results = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        },
        category: {
          type: CategoryType.expense
        }
      },
      _sum: {
        amount: true
      }
    })

    const categoryIds = results.map(r => r.categoryId)
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds
        }
      },
      select: {
        id: true,
        name: true,
        color: true
      }
    })

    const categoryMap = new Map(categories.map(c => [c.id, { name: c.name, color: c.color }]))

    return results
      .map((result) => {
        const category = categoryMap.get(result.categoryId)
        if (!category) return null

        return {
          categoryId: result.categoryId,
          categoryName: category.name,
          categoryColor: category.color,
          totalAmount: Number(result._sum.amount) || 0
        }
      })
      .filter((item): item is CategoryAggregation => item !== null)
      .sort((a, b) => b.totalAmount - a.totalAmount)
  },

  async getRecurringTransactionsSummary(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<RecurringTransactionsSummary> {
    const results = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        isRecurring: true,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    })

    const categoryIds = results.map(r => r.categoryId)
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds
        }
      },
      select: {
        id: true,
        type: true
      }
    })

    const categoryTypeMap = new Map(categories.map(c => [c.id, c.type]))

    let totalIncome = 0
    let totalExpenses = 0
    let incomeCount = 0
    let expensesCount = 0

    for (const result of results) {
      const amount = Number(result._sum.amount) || 0
      const count = result._count.id
      const categoryType = categoryTypeMap.get(result.categoryId)

      if (categoryType === CategoryType.income) {
        totalIncome += amount
        incomeCount += count
      } else if (categoryType === CategoryType.expense) {
        totalExpenses += amount
        expensesCount += count
      }
    }

    return {
      totalIncome,
      totalExpenses,
      incomeCount,
      expensesCount
    }
  }
}
