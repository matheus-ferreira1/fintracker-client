import { uuidSchema } from '#shared/schemas/uuid'
import { categoryService } from '~~/server/services/category.service'
import { updateCategorySchema } from '~~/shared/schemas/category'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const catId = getRouterParam(event, 'catId')
  const { success: validatedParam } = uuidSchema.safeParse(catId)
  if (!validatedParam || !catId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid transaction ID'
    })
  }

  const { success, data } = await readValidatedBody(event, body => updateCategorySchema.safeParse(body))
  if (!success) throw createError({
    statusCode: 400,
    message: 'Incorrect structure'
  })

  const updatedCategory = await categoryService.updateCategory(user.id, catId!, data as UpdateCategoryInput)

  return {
    status: 'success',
    data: updatedCategory
  }
})
