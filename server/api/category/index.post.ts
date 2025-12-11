import { categorySchema } from '#shared/schemas/category'
import { categoryService } from '~~/server/services/category.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const { success, data } = await readValidatedBody(event, body => categorySchema.safeParse(body))

  if (!success) throw createError({
    statusCode: 400,
    message: 'Incorrect structure'
  })

  const category = await categoryService.createCategory(user.id, data as CreateCategoryInput)
  setResponseStatus(event, 201)
  return {
    status: 'success',
    data: category
  }
})
