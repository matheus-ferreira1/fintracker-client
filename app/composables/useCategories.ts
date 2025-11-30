import type { ApiResponse } from '~/types/api.types'
import type { Category, CategoryTypeEnum, CreateCategoryInput, UpdateCategoryInput } from '~/types/category.types'

export function useCategories(type: CategoryTypeEnum) {
  const toast = useToast()
  const { $api } = useNuxtApp()

  const isMutationLoading = ref(false)

  async function createCategory(
    payload: CreateCategoryInput
  ): Promise<void> {
    isMutationLoading.value = true

    try {
      await $api<ApiResponse<Category>>('/categories', {
        method: 'POST',
        body: payload,
        async onResponse() {
          await refreshNuxtData(`${type}-categories`)
        }
      })
      toast.add({
        title: 'Category created successfully!'
      })
    } catch (err) {
      toast.add({
        title: 'Something went wrong',
        description: parseApiError(err),
        color: 'error'
      })
    } finally {
      isMutationLoading.value = false
    }
  }

  async function updateCategory(
    data: UpdateCategoryInput
  ): Promise<void> {
    isMutationLoading.value = true

    try {
      const { id, color, name } = data
      await $api(`/categories/${id}`, {
        method: 'PATCH',
        body: { color, name },
        async onResponse() {
          await refreshNuxtData(`${type}-categories`)
        }
      })
      toast.add({
        title: 'Category updated successfully!'
      })
    } catch (err) {
      toast.add({
        title: 'Something went wrong',
        description: parseApiError(err),
        color: 'error'
      })
    } finally {
      isMutationLoading.value = false
    }
  }

  async function deleteCategory(id: string): Promise<void> {
    isMutationLoading.value = true

    try {
      await $api(`/categories/${id}`, {
        method: 'DELETE',
        async onResponse() {
          await refreshNuxtData(`${type}-categories`)
        }
      })
      toast.add({
        title: 'Category deleted successfully!'
      })
    } catch (err) {
      toast.add({
        title: 'Something went wrong',
        description: parseApiError(err),
        color: 'error'
      })
    } finally {
      isMutationLoading.value = false
    }
  }

  return {
    loading: readonly(isMutationLoading),
    createCategory,
    updateCategory,
    deleteCategory
  }
}
