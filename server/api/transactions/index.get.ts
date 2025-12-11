import type { CategoryType } from '~~/prisma/generated/enums'
import { transactionService } from '~~/server/services/transaction.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const query = getQuery(event)

  const filters: {
    period?: string
    categoryId?: string
    search?: string
    type?: CategoryType
    page?: number
    limit?: number
  } = {}

  if (query.period && typeof query.period === 'string') {
    filters.period = query.period
  }

  if (query.categoryId && typeof query.categoryId === 'string') {
    filters.categoryId = query.categoryId
  }

  if (query.search && typeof query.search === 'string') {
    filters.search = query.search
  }

  if (query.type && (query.type === 'income' || query.type === 'expense')) {
    filters.type = query.type
  }

  if (query.page) {
    const page = Number.parseInt(query.page as string, 10)
    if (!Number.isNaN(page) && page > 0) {
      filters.page = page
    }
  }

  if (query.limit) {
    const limit = Number.parseInt(query.limit as string, 10)
    if (!Number.isNaN(limit) && limit > 0 && limit <= 100) {
      filters.limit = limit
    }
  }

  const result = await transactionService.getTransactions(user.id, filters)

  return {
    status: 'success',
    data: result
  }
})
