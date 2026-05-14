import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/orm'
import DistributorCategory from './distributor_category.ts'
import Vendor from '../../vendor/models/vendor.ts'

export default class Distributor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare eventId: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => DistributorCategory, {
    foreignKey: 'distributorId',
  })
  declare categories: HasMany<typeof DistributorCategory>

  @hasMany(() => Vendor, {
    foreignKey: 'distributorId',
  })
  declare vendors: HasMany<typeof Vendor>
}
