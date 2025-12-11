import { uuidSchema } from '#shared/schemas/uuid'
import { transactionService } from '~~/server/services/transaction.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const id = getRouterParam(event, 'id')
  const { success } = uuidSchema.safeParse(id)
  if (!success || !id) {
    throw createError({
      statusCode: 400,
      message: 'Invalid transaction ID'
    })
  }

  await transactionService.deleteTransaction(user.id, id)

  setResponseStatus(event, 204)
  return null
})
