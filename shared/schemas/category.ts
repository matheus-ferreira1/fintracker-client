import z from 'zod'
import { CategoryType } from '~~/prisma/generated/enums'

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  type: z.enum(CategoryType),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
})

export type CategorySchema = z.output<typeof categorySchema>

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name max characters count is 100')
    .trim()
    .optional(),

  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
    .optional()
})
  .refine(
    data => data.name !== undefined || data.color !== undefined,
    {
      message: 'At least one field (name or color) must be provided'
    }
  )
