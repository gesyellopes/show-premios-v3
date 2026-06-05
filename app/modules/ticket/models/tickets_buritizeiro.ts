import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TicketsBuritizeiro extends BaseModel {
  public static table = 'tickets_buritizeiro'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ticketNumber: string

  @column()
  declare eventId: number

  @column()
  declare organizationId: number | null

  @column()
  declare unitId: number | null

  @column()
  declare groupId: number | null

  @column()
  declare vendorId: number | null

  @column.dateTime()
  declare deliveredOn: DateTime | null

  @column()
  declare validated: number

  @column.dateTime()
  declare validatedOn: DateTime | null

  @column()
  declare ticketMirror: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
