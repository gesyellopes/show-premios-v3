import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/orm'
import Distributor from '../../distributor/models/distributor.ts'
import DistributorCategory from '../../distributor/models/distributor_category.ts'

export default class Vendor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare eventId: number

  @column()
  declare distributorId: number | null

  @column()
  declare distributorCategoryId: number | null

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

  @belongsTo(() => DistributorCategory, {
    foreignKey: 'distributorCategoryId',
  })
  declare category: BelongsTo<typeof DistributorCategory>
}
