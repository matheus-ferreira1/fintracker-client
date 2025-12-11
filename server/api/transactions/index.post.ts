import { createTransactionSchema } from '#shared/schemas/transaction'
import { transactionService } from '~~/server/services/transaction.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const { success, data } = await readValidatedBody(event, body =>
    createTransactionSchema.safeParse(body)
  )

  if (!success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request data'
    })
  }

  const transaction = await transactionService.createTransaction(user.id, data)
  setResponseStatus(event, 201)

  return {
    status: 'success',
    data: transaction
  }
})
