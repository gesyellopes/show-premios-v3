import db from '@adonisjs/lucid/services/db'
import { randomUUID } from 'node:crypto'
import Person from '../models/person.js'
import User from '../models/user.js'

export default class IdentityService {
  async register(payload: any, forceRole?: string) {
    return await db.transaction(async (trx) => {
      // 1. Criar a Person
      const person = new Person()
      person.useTransaction(trx)
      person.fill({
        uuid: randomUUID(),
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        status: 'active',
      })
      await person.save()

      // 2. Criar o User vinculado
      const user = new User()
      user.useTransaction(trx)
      user.fill({
        uuid: randomUUID(),
        personId: person.id,
        email: payload.email, // Geralmente o email de login é o mesmo da pessoa
        password: payload.password,
        role: forceRole || payload.role || 'user',
        status: 'active',
      })
      await user.save()

      return { person, user }
    })
  }

  async findByUuid(uuid: string) {
    return await User.query().where('uuid', uuid).preload('person').firstOrFail()
  }
}
