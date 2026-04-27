
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import NotificationMessage from './notification_message.js'

export default class NotificationMessageLog extends BaseModel {
  public static table = 'notification_message_logs'

  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column({ columnName: 'tenant_id' })
  declare tenantId: number

  @column({ columnName: 'notification_message_id' })
  declare notificationMessageId: number

  @column({ columnName: 'type' })
  declare type: string

  @column({ columnName: 'status' })
  declare status: string | null

  @column({ columnName: 'message' })
  declare message: string | null

  @column({ columnName: 'context' })
  declare context: Record<string, any> | null

  @belongsTo(() => NotificationMessage, {
    foreignKey: 'notificationMessageId',
  })
  declare notificationMessage: BelongsTo<typeof NotificationMessage>

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime
}
