import { transactionService } from '~~/server/services/transaction.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const periods = await transactionService.getAvailablePeriods(user.id)

  return {
    status: 'success',
    data: periods
  }
})
