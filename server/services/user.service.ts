import type { UserDTO } from '~~/shared/types/user.types'
import { userRepository } from '../repositories/user.repository'
import { createHashedPassword } from '../utils/password'

export const userService = {
  async register(registerData: RegisterPayload): Promise<UserDTO> {
    const emailExists = await userRepository.emailExists(registerData.email)
    if (emailExists) throw createError({
      statusCode: 409,
      message: 'Email already registered'
    })

    const hashedPassword = await createHashedPassword(registerData.password)

    const user = await userRepository.create({
      ...registerData,
      password: hashedPassword
    })

    return user
  },

  async login(loginData: LoginPayload): Promise<UserDTO> {
    const user = await userRepository.findByEmail(loginData.email)
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      })
    }

    const isPasswordValid = await comparePassword(
      loginData.password,
      user.password
    )
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      })
    }

    const { password, ...userWithoutPassword } = user

    return userWithoutPassword
  }
}
