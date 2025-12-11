import type { UpdateProfileDTO } from '~~/shared/types/user.types'
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
  },

  async update(userId: string,
    updateData: UpdateProfileDTO
  ): Promise<UserDTO> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    if (updateData.email && updateData.email !== user.email) {
      const emailInUse = await userRepository.emailExistsExcludingUser(
        updateData.email,
        userId
      )
      if (emailInUse) {
        throw createError({
          statusCode: 409,
          message: 'Email already in use'
        })
      }
    }

    const updatedUser = await userRepository.update(userId, updateData)
    if (!updatedUser) {
      throw createError({
        statusCode: 500,
        message: 'Failed to update profile'
      })
    }

    return updatedUser
  },

  async resetPassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    const isOldPasswordValid = await comparePassword(
      oldPassword,
      user.password
    )
    if (!isOldPasswordValid) {
      throw createError({
        statusCode: 400,
        message: 'Invalid credentials'
      })
    }

    const isSamePassword = await comparePassword(newPassword, user.password)
    if (isSamePassword) {
      throw createError({
        statusCode: 400,
        message: 'New password must be different from current password'
      })
    }

    const hashedNewPassword = await createHashedPassword(newPassword)

    const updated = await userRepository.updatePassword(
      userId,
      hashedNewPassword
    )
    if (!updated) {
      throw createError({
        statusCode: 500,
        message: 'Failed to update password'
      })
    }
  }
}
