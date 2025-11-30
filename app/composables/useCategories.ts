import type { ApiResponse } from '~/types/api.types'
import type { Category, CategoryTypeEnum, CreateCategoryInput, UpdateCategoryInput } from '~/types/category.types'

export function useCategories(type: CategoryTypeEnum) {
  const toast = useToast()
  const { $api } = useNuxtApp()

  const isMutationLoading = ref(false)
  const failed = ref(false)

  const { data, pending, error: fetchError, refresh } = useAPI<ApiResponse<Category[]>>(`/categories?type=${type}`, { key: 'income-categories' })
  const categories = computed(() => data.value?.data || [])
  const error = computed(() => failed.value || fetchError.value)

  const loading = computed(() => pending.value || isMutationLoading.value)

  async function createCategory(
    payload: CreateCategoryInput
  ): Promise<void> {
    isMutationLoading.value = true
    failed.value = false

    try {
      await $api<ApiResponse<Category>>('/categories', {
        method: 'POST',
        body: payload,
        async onResponse() {
          await refresh()
        }
      })
      toast.add({
        title: 'Category created successfully!'
      })
    } catch (err) {
      failed.value = true
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
    failed.value = false

    try {
      const { id, color, name } = data
      await $api(`/categories/${id}`, {
        method: 'PATCH',
        body: { color, name },
        async onResponse() {
          await refresh()
        }
      })
      toast.add({
        title: 'Category updated successfully!'
      })
    } catch (err) {
      failed.value = true
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
    failed.value = false

    try {
      await $api(`/categories/${id}`, {
        method: 'DELETE',
        async onResponse() {
          await refresh()
        }
      })
      toast.add({
        title: 'Category deleted successfully!'
      })
    } catch (err) {
      failed.value = true
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
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
