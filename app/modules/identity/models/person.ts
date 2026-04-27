import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import PersonMeta from './person_meta.js'
import User from './user.js'

export default class Person extends BaseModel {
  public static table = 'persons'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string

  @column()
  declare documentType: string | null

  @column()
  declare documentNumber: string | null

  @column()
  declare fullName: string

  @column()
  declare displayName: string | null

  @column.date()
  declare birthDate: DateTime | null

  @column()
  declare phone: string | null

  @column()
  declare email: string | null

  @column()
  declare gender: string | null

  @column()
  declare status: string

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @hasMany(() => PersonMeta, {
    foreignKey: 'personId',
  })
  declare metas: HasMany<typeof PersonMeta>

  @hasMany(() => User, {
    foreignKey: 'personId',
  })
  declare users: HasMany<typeof User>
}
