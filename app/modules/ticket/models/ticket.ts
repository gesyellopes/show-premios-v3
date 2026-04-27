import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string

  @column()
  declare eventId: number

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

  @beforeCreate()
  static async assignUuidAndUlid(ticket: Ticket) {
    ticket.uuid = randomUUID()
  }
}
