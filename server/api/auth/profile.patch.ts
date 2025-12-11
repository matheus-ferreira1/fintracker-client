import { profileSchema } from '#shared/schemas/profile'
import { userService } from '~~/server/services/user.service'

export default defineEventHandler(async (event) => {
  const profileData = await readValidatedBody(event, profileSchema.parse)

  const { user } = await requireUserSession(event)
  if (!user) throw createError({
    statusCode: 401,
    message: 'Cannot update the user profile'
  })

  const updatedUser = await userService.update(user.id, profileData)

  await setUserSession(event, {
    user: updatedUser
  })

  return {
    status: 'success',
    data: updatedUser
  }
})
