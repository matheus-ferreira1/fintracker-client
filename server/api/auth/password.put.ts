import { passwordSchema } from '#shared/schemas/password'
import { userService } from '~~/server/services/user.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) throw createError({
    statusCode: 401,
    message: 'Cannot update the user profile'
  })

  const passwordData = await readValidatedBody(event, passwordSchema.parse)

  await userService.resetPassword(user.id, passwordData.oldPassword, passwordData.newPassword)

  return {
    status: 'success',
    message: 'Password updated successfully'
  }
})
