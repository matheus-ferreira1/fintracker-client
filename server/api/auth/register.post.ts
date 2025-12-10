import { registerSchema } from '#shared/schemas/register'
import { userService } from '~~/server/services/user.service'

export default defineEventHandler(async (event) => {
  const { email, password, name } = await readValidatedBody(event, registerSchema.parse)

  const user = await userService.register({ email, password, name })

  await setUserSession(event, {
    user
  })

  return {
    status: 'success',
    data: user
  }
})
