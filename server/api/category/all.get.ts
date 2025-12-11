import { categoryService } from '~~/server/services/category.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const { type } = getQuery(event)

  const categories = await categoryService.getCategories(user.id, type as CategoryType)

  return {
    status: 'success',
    data: categories
  }
})
