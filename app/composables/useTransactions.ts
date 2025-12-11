export function useTransactions(type: CategoryType) {
  const toast = useToast()
  const { $api } = useNuxtApp()

  const isMutationLoading = ref(false)

  async function createTransation(payload: CreateTransactionDTO): Promise<void> {
    isMutationLoading.value = true

    try {
      await $api<ApiResponse<Transaction>>('/api/transactions', {
        method: 'POST',
        body: payload,
        async onResponse() {
          await refreshNuxtData(`${type}-transactions`)
        }
      })

      const transactionLabel = type === 'expense' ? 'Expense' : 'Income'
      toast.add({
        title: `${transactionLabel} created successfully!`,
        color: 'success'
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

  async function updateTransation(id: string, payload: UpdateTransactionDTO): Promise<void> {
    isMutationLoading.value = true

    try {
      await $api<ApiResponse<Transaction>>(`/api/transactions/${id}`, {
        method: 'PATCH',
        body: payload,
        async onResponse() {
          await refreshNuxtData(`${type}-transactions`)
        }
      })

      const transactionLabel = type === 'expense' ? 'Expense' : 'Income'
      toast.add({
        title: `${transactionLabel} updated successfully!`,
        color: 'success'
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

  async function deleteTransation(id: string): Promise<void> {
    isMutationLoading.value = true

    try {
      await $api<ApiResponse<undefined>>(`/api/transactions/${id}`, {
        method: 'DELETE',
        async onResponse() {
          await refreshNuxtData(`${type}-transactions`)
        }
      })

      const transactionLabel = type === 'expense' ? 'Expense' : 'Income'
      toast.add({
        title: `${transactionLabel} deleted successfully!`,
        color: 'success'
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
    createTransation,
    updateTransation,
    deleteTransation
  }
}
