import { loginSchema } from '#shared/schemas/login'
import { userService } from '~~/server/services/user.service'

export default defineEventHandler(async (event) => {
  const loginData = await readValidatedBody(event, loginSchema.parse)

  const user = await userService.login(loginData)

  await setUserSession(event, {
    user
  })

  return {
    status: 'success',
    data: user
  }
})
