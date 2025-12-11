import { transactionService } from '~~/server/services/transaction.service'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const id = getRouterParam(event, 'id')

  const { success } = z.string().uuid().safeParse(id)
  if (!success || !id) {
    throw createError({
      statusCode: 400,
      message: 'Invalid transaction ID'
    })
  }

  const transaction = await transactionService.getTransaction(user.id, id)

  return {
    status: 'success',
    data: transaction
  }
})
