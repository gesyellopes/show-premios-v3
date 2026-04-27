
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import NotificationTemplate from './notification_template.js'
import NotificationMessage from './notification_message.js'

export default class Notification extends BaseModel {
  public static table = 'notifications'

  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column({ columnName: 'tenant_id' })
  declare tenantId: number

  @column({ columnName: 'template_id' })
  declare templateId: number | null

  @column({ columnName: 'event_key' })
  declare eventKey: string

  @column({ columnName: 'notifiable_type' })
  declare notifiableType: string | null

  @column({ columnName: 'notifiable_id' })
  declare notifiableId: number | null

  @column({ columnName: 'recipient' })
  declare recipient: string

  @column({ columnName: 'recipient_name' })
  declare recipientName: string | null

  @column({ columnName: 'payload' })
  declare payload: Record<string, any> | null

  @column({ columnName: 'status' })
  declare status: string

  @column({ columnName: 'priority' })
  declare priority: number

  @column.dateTime({ columnName: 'scheduled_at' })
  declare scheduledAt: DateTime | null

  @column.dateTime({ columnName: 'sent_at' })
  declare sentAt: DateTime | null

  @column.dateTime({ columnName: 'failed_at' })
  declare failedAt: DateTime | null

  @belongsTo(() => NotificationTemplate, {
    foreignKey: 'templateId',
  })
  declare template: BelongsTo<typeof NotificationTemplate>

  @hasMany(() => NotificationMessage, {
    foreignKey: 'notificationId',
  })
  declare messages: HasMany<typeof NotificationMessage>

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'updated_at', autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime({ columnName: 'deleted_at' })
  declare deletedAt: DateTime | null
}
