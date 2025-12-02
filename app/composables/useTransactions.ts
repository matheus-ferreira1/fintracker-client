import type { ApiResponse } from '~/types/api.types'
import type { CreateTransactionDTO, Transaction, TransactionEnum, UpdateTransactionDTO } from '~/types/transaction.types'

export function useTransactions(type: TransactionEnum) {
  const toast = useToast()
  const { $api } = useNuxtApp()

  const isMutationLoading = ref(false)

  async function createTransation(payload: CreateTransactionDTO): Promise<void> {
    isMutationLoading.value = true

    try {
      await $api<ApiResponse<Transaction>>('/transactions', {
        method: 'POST',
        body: payload,
        async onResponse() {
          await Promise.all([
            refreshNuxtData(`${type}-transactions`),
            refreshNuxtData(`expenses-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`),
            refreshNuxtData(`income-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)
          ])
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
      await $api<ApiResponse<Transaction>>(`/transactions/${type}s/${id}`, {
        method: 'PATCH',
        body: payload,
        async onResponse() {
          await Promise.all([
            refreshNuxtData(`${type}-transactions`),
            refreshNuxtData(`expenses-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`),
            refreshNuxtData(`income-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)
          ])
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
      await $api(`/transactions/${type}s/${id}`, {
        method: 'DELETE',
        async onResponse() {
          await Promise.all([
            refreshNuxtData(`${type}-transactions`),
            refreshNuxtData(`expenses-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`),
            refreshNuxtData(`income-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)
          ])
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
