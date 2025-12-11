import type { DashboardFilters } from '~~/server/types/dashboard.types'
import { dashboardService } from '~~/server/services/dashboard.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const query = getQuery(event)

  const filters: DashboardFilters = {}

  if (query.period && typeof query.period === 'string') {
    const periodRegex = /^(0[1-9]|1[0-2])\d{4}$/
    if (!periodRegex.test(query.period)) {
      throw createError({
        statusCode: 400,
        message: 'Period must be in format MMYYYY (e.g., 012025 for January 2025)'
      })
    }
    filters.period = query.period
  }

  const dashboard = await dashboardService.getDashboard(user.id, filters)

  return {
    status: 'success',
    data: dashboard
  }
})
