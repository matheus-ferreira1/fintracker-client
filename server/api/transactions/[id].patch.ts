import { updateTransactionSchema } from '#shared/schemas/transaction'
import { z } from 'zod'
import { transactionService } from '~~/server/services/transaction.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const id = getRouterParam(event, 'id')
  const { success } = z.uuid().safeParse(id)
  if (!success || !id) {
    throw createError({
      statusCode: 400,
      message: 'Invalid transaction ID'
    })
  }

  const bodyValidation = await readValidatedBody(event, body =>
    updateTransactionSchema.safeParse(body)
  )

  if (!bodyValidation.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request data'
    })
  }

  const updatedTransaction = await transactionService.updateTransaction(user.id, id, bodyValidation.data)

  return {
    status: 'success',
    data: updatedTransaction
  }
})
