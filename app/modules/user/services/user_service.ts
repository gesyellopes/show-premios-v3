import { randomUUID } from 'node:crypto'
import User from '../models/user.js'
import type { UserPayload } from '../types/user.js'

export default class UserService {
  async list() {
    return await User.query().select(
      'id',
      'uuid',
      'name',
      'email',
      'phone',
      'role',
      'createdAt',
      'updatedAt'
    )
  }

  async find(id: number | string) {
    const user = await User.find(id)

    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  async create(payload: UserPayload) {
    const user = new User()
    user.uuid = randomUUID()
    user.name = payload.name
    user.phone = payload.phone || ''

    // Se email não foi fornecido, gera a partir do telefone
    if (payload.email) {
      user.email = payload.email
    } else {
      user.email = `${payload.phone}@showdepremios.cloud`
    }

    user.password = payload.password
    user.role = payload.role || 'vendor'

    await user.save()

    return {
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  async update(id: number | string, payload: Partial<UserPayload>) {
    const user = await User.find(id)

    if (!user) {
      throw new Error('User not found')
    }

    if (payload.name) {
      user.name = payload.name
    }

    if (payload.phone) {
      user.phone = payload.phone
    }

    if (payload.password) {
      user.password = payload.password
    }

    if (payload.role) {
      user.role = payload.role
    }

    await user.save()

    return {
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  async delete(id: number | string) {
    const user = await User.find(id)

    if (!user) {
      throw new Error('User not found')
    }

    await user.delete()

    return {
      id: user.id,
      deleted: true,
    }
  }
}
