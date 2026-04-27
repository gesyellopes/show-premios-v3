
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Notification from './notification.js'
import NotificationMessageLog from './notification_message_log.js'

export default class NotificationMessage extends BaseModel {
  public static table = 'notification_messages'

  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column({ columnName: 'tenant_id' })
  declare tenantId: number

  @column({ columnName: 'notification_id' })
  declare notificationId: number

  @column({ columnName: 'channel' })
  declare channel: string

  @column({ columnName: 'provider' })
  declare provider: string | null

  @column({ columnName: 'to' })
  declare to: string

  @column({ columnName: 'subject' })
  declare subject: string | null

  @column({ columnName: 'content' })
  declare content: string

  @column({ columnName: 'rendered_payload' })
  declare renderedPayload: Record<string, any> | null

  @column({ columnName: 'status' })
  declare status: string

  @column({ columnName: 'external_id' })
  declare externalId: string | null

  @column({ columnName: 'provider_response' })
  declare providerResponse: Record<string, any> | null

  @column({ columnName: 'attempts' })
  declare attempts: number

  @column({ columnName: 'retry_limit' })
  declare retryLimit: number

  @column.dateTime({ columnName: 'next_retry_at' })
  declare nextRetryAt: DateTime | null

  @column.dateTime({ columnName: 'last_attempt_at' })
  declare lastAttemptAt: DateTime | null

  @column({ columnName: 'provider_config_tag' })
  declare providerConfigTag: string | null

  @column.dateTime({ columnName: 'sent_at' })
  declare sentAt: DateTime | null

  @column.dateTime({ columnName: 'failed_at' })
  declare failedAt: DateTime | null

  @column.dateTime({ columnName: 'delivered_at' })
  declare deliveredAt: DateTime | null

  @column.dateTime({ columnName: 'read_at' })
  declare readAt: DateTime | null

  @belongsTo(() => Notification, {
    foreignKey: 'notificationId',
  })
  declare notification: BelongsTo<typeof Notification>

  @hasMany(() => NotificationMessageLog, {
    foreignKey: 'notificationMessageId',
  })
  declare logs: HasMany<typeof NotificationMessageLog>

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'updated_at', autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime({ columnName: 'deleted_at' })
  declare deletedAt: DateTime | null
}
