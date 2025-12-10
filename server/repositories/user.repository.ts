import type { User } from '~~/prisma/generated/client'
import type { UserDTO } from '~~/shared/types/user.types'

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
  }
}
