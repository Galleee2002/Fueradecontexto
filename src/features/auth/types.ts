export interface AuthUser {
  id: string
  email: string
  name: string | null
}

export interface LoginInput {
  email: string
  password: string
}
