import { uuidSchema } from '#shared/schemas/uuid'
import { categoryService } from '~~/server/services/category.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const catId = getRouterParam(event, 'catId')
  if (!uuidSchema.safeParse(catId) && catId !== undefined) {
    throw createError({
      statusCode: 400,
      message: 'Invalid category ID'
    })
  }

  await categoryService.deleteCategory(user.id, catId!)

  setResponseStatus(event, 204)
  return {
    status: 'success'
  }
})
