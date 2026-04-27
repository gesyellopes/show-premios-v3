import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TicketWhatsappMessage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare messageId: string

  @column()
  declare senderNumber: string

  @column()
  declare senderName: string | null

  @column.dateTime()
  declare sentAt: DateTime

  @column()
  declare whatsappMessageId: string

  @column()
  declare attempts: number

  @column()
  declare filename: string | null

  @column()
  declare ticketNumber: string | null

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null
}
