import hash from '@adonisjs/core/services/hash'
import User from '../models/user.js'
import type { AuthToken } from '../types/user.js'

export default class AuthService {
  async login(login: string, password: string): Promise<AuthToken> {
    // Tenta buscar por email primeiro
    let user = await User.query().where('email', login).first()

    // Se não encontrar por email, tenta por telefone
    if (!user) {
      user = await User.query().where('phone', login).first()
    }

    if (!user) {
      throw new Error('User not found')
    }

    const isValidPassword = await hash.verify(user.password, password)

    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const token = Math.random().toString(36).substr(2) + Date.now().toString(36)

    return {
      type: 'bearer',
      token,
      expiresIn: 7200,
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }
}
