import type { Category, CategoryType } from '~/types/category.types'

async function fetchCategoriesFromAPI(): Promise<Category[]> {
  await new Promise(resolve => setTimeout(resolve, 300))

  return [
    {
      id: '1',
      name: 'Salary',
      color: '#10b981',
      isDefault: true,
      type: 'income'
    },
    {
      id: '2',
      name: 'Freelance',
      color: '#3b82f6',
      isDefault: true,
      type: 'income'
    },
    {
      id: '3',
      name: 'Investment',
      color: '#8b5cf6',
      isDefault: true,
      type: 'income'
    },
    {
      id: '4',
      name: 'Business',
      color: '#f59e0b',
      isDefault: true,
      type: 'income'
    },
    {
      id: '5',
      name: 'Gift',
      color: '#ec4899',
      isDefault: true,
      type: 'income'
    },
    {
      id: '6',
      name: 'Bonus',
      color: '#22c55e',
      isDefault: false,
      type: 'income'
    },
    {
      id: '7',
      name: 'Food & Dining',
      color: '#ef4444',
      isDefault: true,
      type: 'expense'
    },
    {
      id: '8',
      name: 'Transportation',
      color: '#0ea5e9',
      isDefault: true,
      type: 'expense'
    },
    {
      id: '9',
      name: 'Shopping',
      color: '#d946ef',
      isDefault: true,
      type: 'expense'
    },
    {
      id: '10',
      name: 'Entertainment',
      color: '#a855f7',
      isDefault: true,
      type: 'expense'
    },
    {
      id: '11',
      name: 'Bills & Utilities',
      color: '#6366f1',
      isDefault: true,
      type: 'expense'
    },
    {
      id: '12',
      name: 'Health & Fitness',
      color: '#14b8a6',
      isDefault: true,
      type: 'expense'
    },
    {
      id: '13',
      name: 'Housing',
      color: '#f97316',
      isDefault: true,
      type: 'expense'
    },
    {
      id: '14',
      name: 'Pet Care',
      color: '#84cc16',
      isDefault: false,
      type: 'expense'
    }
  ]
}

export function useCategories() {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchCategories() {
    loading.value = true
    error.value = null

    try {
      const data = await fetchCategoriesFromAPI()
      categories.value = data
    } catch (err) {
      error.value
        = err instanceof Error ? err : new Error('Failed to fetch categories')
      console.error('Error fetching categories:', err)
    } finally {
      loading.value = false
    }
  }

  const getCategoriesByType = (type: CategoryType): Category[] => {
    return categories.value.filter(cat => cat.type === type)
  }

  async function createCategory(
    name: string,
    color: string,
    type: CategoryType
  ): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const newCategory: Category = {
        id: `temp-${Date.now()}`,
        name,
        color,
        type,
        isDefault: false
      }

      categories.value.push(newCategory)
    } catch (err) {
      error.value
        = err instanceof Error ? err : new Error('Failed to create category')
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(
    id: string,
    name: string,
    color: string
  ): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const index = categories.value.findIndex(cat => cat.id === id)
      if (index !== -1) {
        const existingCategory = categories.value[index]!
        categories.value.splice(index, 1, {
          ...existingCategory,
          name,
          color
        })
      }
    } catch (err) {
      error.value
        = err instanceof Error ? err : new Error('Failed to update category')
      throw error.value
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      categories.value = categories.value.filter(cat => cat.id !== id)
    } catch (err) {
      error.value
        = err instanceof Error ? err : new Error('Failed to delete category')
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoriesByType,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
