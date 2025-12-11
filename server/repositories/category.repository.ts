import type { Category } from '~~/prisma/generated/client'
import type { CategoryType } from '~~/prisma/generated/enums'

export const categoryRepository = {
  async findByUserId(userId: string, type: CategoryType): Promise<Category[]> {
    return prisma.category.findMany({
      where: {
        type,
        OR: [
          { userId },
          { userId: null }
        ]
      }
    })
  },

  async findById(id: string, userId: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id, userId }
    })
  },

  async nameExists(
    userId: string,
    name: string,
    type: CategoryType
  ): Promise<boolean> {
    const count = await prisma.category.count({
      where: { userId, name, type }
    })
    return count > 0
  },

  async create(
    userId: string,
    categoryData: CreateCategoryInput,
    isDefault: boolean = false
  ): Promise<Category> {
    return prisma.category.create({
      data: {
        userId,
        ...categoryData,
        isDefault
      }
    })
  },

  async update(
    id: string,
    userId: string,
    payload: UpdateCategoryInput
  ): Promise<Category | null> {
    return prisma.category.update({
      where: { id, userId },
      data: payload
    })
  },

  async delete(id: string, userId: string) {
    return prisma.category.delete({
      where: { id, userId }
    })
  }
}
