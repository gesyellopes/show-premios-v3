import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/orm'
import Distributor from './distributor.ts'

export default class DistributorCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare distributorId: number

  @column()
  declare eventId: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Distributor, {
    foreignKey: 'distributorId',
  })
  declare distributor: BelongsTo<typeof Distributor>
}
