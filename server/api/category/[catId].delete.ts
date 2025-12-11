import { uuidSchema } from '#shared/schemas/uuid'
import { categoryService } from '~~/server/services/category.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const catId = getRouterParam(event, 'catId')
  const { success } = uuidSchema.safeParse(catId)
  if (!success || !catId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid transaction ID'
    })
  }

  await categoryService.deleteCategory(user.id, catId!)

  setResponseStatus(event, 204)
  return {
    status: 'success'
  }
})
