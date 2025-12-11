import type { Category } from '~~/prisma/generated/client'
import { categoryRepository } from '../repositories/category.repository'

export const categoryService = {
  async getCategories(userId: string, type: CategoryType): Promise<Category[]> {
    return categoryRepository.findByUserId(userId, type)
  },

  async getCategory(userId: string, categoryId: string): Promise<Category> {
    const category = await categoryRepository.findById(categoryId, userId)

    if (!category) {
      throw createError({
        statusCode: 404,
        message: 'Category not found'
      })
    }

    return category
  },

  async createCategory(
    userId: string,
    categoryData: CreateCategoryInput
  ): Promise<Category> {
    const exists = await categoryRepository.nameExists(
      userId,
      categoryData.name,
      categoryData.type
    )

    if (exists) {
      throw createError({
        statusCode: 409,
        message: `A ${categoryData.type} category with name "${categoryData.name}" already exists`
      })
    }

    return await categoryRepository.create(userId, categoryData, false)
  },

  async updateCategory(
    userId: string,
    categoryId: string,
    updates: UpdateCategoryInput
  ): Promise<Category> {
    const existingCategory = await this.getCategory(userId, categoryId)

    if (existingCategory.isDefault) {
      throw createError({
        statusCode: 403,
        message: 'Cannot update default categories'
      })
    }

    if (updates.name && updates.name !== existingCategory.name) {
      const exists = await categoryRepository.nameExists(
        userId,
        updates.name,
        existingCategory.type
      )

      if (exists) {
        throw createError({
          statusCode: 409,
          message: `A ${existingCategory.type} category with name "${updates.name}" already exists`
        })
      }
    }

    const updatedCategory = await categoryRepository.update(
      categoryId,
      userId,
      updates
    )

    if (!updatedCategory) {
      throw createError({
        statusCode: 404,
        message: 'Category not found or cannot be updated'
      })
    }

    return updatedCategory
  },

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const existingCategory = await this.getCategory(userId, categoryId)
    if (existingCategory.isDefault) {
      throw createError({
        statusCode: 403,
        message: 'Cannot delete default categories'
      })
    }

    const deleted = await categoryRepository.delete(categoryId, userId)

    if (!deleted) {
      throw createError({
        statusCode: 404,
        message: 'Category not found or cannot be deleted'
      })
    }
  }
}
