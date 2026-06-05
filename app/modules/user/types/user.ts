export interface UserPayload {
  id?: number
  uuid?: string
  name: string
  email: string
  phone: string
  password: string
  role?: 'admin' | 'manager' | 'vendor'
}

export interface UserResponse {
  id: number
  uuid: string
  name: string
  email: string
  phone: string
  role: string
  createdAt: string
  updatedAt: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthToken {
  type: string
  token: string
  expiresIn: number
  user: {
    id: number
    uuid: string
    name: string
    email: string
    role: string
  }
}
