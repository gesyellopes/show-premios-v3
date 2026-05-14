import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import Distributor from '../../../modules/distributor/models/distributor.ts'
import Vendor from '../../../modules/vendor/models/vendor.ts'
import DistributorCategory from '../../../modules/distributor/models/distributor_category.ts'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string

  @column()
  declare eventId: number

  @column()
  declare distributorId: number | null

  @column()
  declare vendorId: number | null

  @column()
  declare distributorCategoryId: number | null

  @column()
  declare ticketNumber: string

  @column()
  declare status: string

  @column()
  declare messageId: string | null

  @column.dateTime()
  declare validatedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Distributor, {
    foreignKey: 'distributorId',
  })
  declare distributor: BelongsTo<typeof Distributor>

  @belongsTo(() => Vendor, {
    foreignKey: 'vendorId',
  })
  declare vendor: BelongsTo<typeof Vendor>

  @belongsTo(() => DistributorCategory, {
    foreignKey: 'distributorCategoryId',
  })
  declare category: BelongsTo<typeof DistributorCategory>

  @beforeCreate()
  static async assignUuidAndUlid(ticket: Ticket) {
    ticket.uuid = randomUUID()
  }
}
