import type { User } from '~~/prisma/generated/client'
import type { UpdateProfileDTO } from '~~/shared/types/user.types'

export const userRepository = {
  async create(payload: RegisterPayload): Promise<UserDTO> {
    return prisma.user.create({
      data: payload,
      omit: {
        password: true
      }
    })
  },

  async emailExists(email: string): Promise<boolean> {
    const emailExists = await prisma.user.findFirst({
      where: { email }
    })
    return !!emailExists
  },

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    })
  },

  async emailExistsExcludingUser(
    email: string,
    userId: string
  ): Promise<boolean> {
    const count = await prisma.user.count({
      where: {
        email,
        NOT: {
          id: userId
        }
      }
    })
    return count > 0
  },

  async update(id: string, payload: UpdateProfileDTO): Promise<UserDTO | null> {
    return prisma.user.update({
      where: { id },
      data: payload,
      omit: {
        password: true
      }
    })
  },

  async updatePassword(id: string, password: string): Promise<UserDTO | null> {
    return prisma.user.update({
      where: { id },
      data: { password },
      omit: {
        password: true
      }
    })
  }
}
