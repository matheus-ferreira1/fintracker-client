declare module '#auth-utils' {
  interface User {
    email: string
    name: string
    id: string
    created_at?: Date
    updated_at?: Date
  }
}

export { }
