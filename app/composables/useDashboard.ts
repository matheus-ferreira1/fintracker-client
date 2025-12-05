import type { ApiResponse } from '~/types/api.types'
import type { DashboardResponse } from '~/types/dashboard.types'

export function useDashboard() {
  function getDashboardData() {
    return useAPI<ApiResponse<DashboardResponse>>('/dashboard', {
      cache: 'default'
    })
  }

  return {
    getDashboardData
  }
}
