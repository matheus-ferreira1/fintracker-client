import z from 'zod'

export const createTransactionSchema = z.object({
  categoryId: z.string().uuid({ message: 'Category ID must be a valid UUID' }),
  amount: z
    .number({ message: 'Amount must be a number' })
    .positive({ message: 'Amount must be a positive number' }),
  description: z
    .string()
    .min(1, { message: 'Description cannot be empty' })
    .max(500, { message: 'Description must not exceed 500 characters' })
    .trim(),
  date: z.string().datetime({ message: 'Date must be a valid ISO 8601 date' }),
  isRecurring: z.boolean({ message: 'isRecurring must be a boolean' })
})

export type CreateTransactionSchema = z.output<typeof createTransactionSchema>

export const updateTransactionSchema = z
  .object({
    categoryId: z.string().uuid({ message: 'Category ID must be a valid UUID' }).optional(),
    amount: z
      .number({ message: 'Amount must be a number' })
      .positive({ message: 'Amount must be a positive number' })
      .optional(),
    description: z
      .string()
      .min(1, { message: 'Description cannot be empty' })
      .max(500, { message: 'Description must not exceed 500 characters' })
      .trim()
      .optional(),
    date: z.string().datetime({ message: 'Date must be a valid ISO 8601 date' }).optional(),
    isRecurring: z.boolean({ message: 'isRecurring must be a boolean' }).optional()
  })
  .refine(
    data =>
      data.categoryId !== undefined ||
      data.amount !== undefined ||
      data.description !== undefined ||
      data.date !== undefined ||
      data.isRecurring !== undefined,
    {
      message: 'At least one field must be provided for update'
    }
  )

export type UpdateTransactionSchema = z.output<typeof updateTransactionSchema>

export const transactionFiltersSchema = z.object({
  period: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\d{4}$/, {
      message: 'Period must be in format MMYYYY (e.g., 012025 for January 2025)'
    })
    .optional(),
  categoryId: z.string().uuid({ message: 'Category ID must be a valid UUID' }).optional(),
  search: z
    .string()
    .min(1)
    .max(100, { message: 'Search query must not exceed 100 characters' })
    .trim()
    .optional(),
  type: z.enum(['income', 'expense']).optional(),
  page: z
    .number({ message: 'Page must be a number' })
    .int({ message: 'Page must be an integer' })
    .min(1, { message: 'Page must be at least 1' })
    .optional()
    .default(1),
  limit: z
    .number({ message: 'Limit must be a number' })
    .int({ message: 'Limit must be an integer' })
    .min(1, { message: 'Limit must be at least 1' })
    .max(100, { message: 'Limit must not exceed 100' })
    .optional()
    .default(10)
})

export type TransactionFiltersSchema = z.output<typeof transactionFiltersSchema>
