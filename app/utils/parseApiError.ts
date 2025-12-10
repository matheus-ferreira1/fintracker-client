import type { ApiResponse } from '~~/shared/types/api.types'

export function parseApiError(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    if ('_data' in error) {
      const typed = error._data as ApiResponse<undefined>
      return typed.message || 'Unknown error'
    }
  }

  return 'Unknown error'
}
