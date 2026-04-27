import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Person from './person.js'

export default class PersonMeta extends BaseModel {
  public static table = 'person_meta'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare personId: number

  @column()
  declare key: string

  @column()
  declare value: string | null

  @column()
  declare type: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Person, {
    foreignKey: 'personId',
  })
  declare person: BelongsTo<typeof Person>
}