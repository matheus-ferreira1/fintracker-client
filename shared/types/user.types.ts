export interface UserDTO {
  email: string
  name: string
  id: string
  created_at?: Date
  updated_at?: Date
}

export interface UpdateProfileDTO {
  name?: string
  email?: string
}
