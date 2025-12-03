export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface Category {
  id: string
  name: string
  userId?: string
  color: string
  type: CategoryType
  isDefault: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateCategoryInput {
  name: string
  color: string
  type: CategoryType
}

export interface UpdateCategoryInput {
  id: string
  name: string
  color: string
}

export const PREDEFINED_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#64748b',
  '#6b7280',
  '#78716c'
] as const
