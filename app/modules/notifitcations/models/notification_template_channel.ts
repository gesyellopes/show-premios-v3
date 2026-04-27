
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import NotificationTemplate from './notification_template.js'

export default class NotificationTemplateChannel extends BaseModel {
  public static table = 'notification_template_channels'

  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column({ columnName: 'tenant_id' })
  declare tenantId: number

  @column({ columnName: 'notification_template_id' })
  declare notificationTemplateId: number

  @column({ columnName: 'channel' })
  declare channel: string

  @column({ columnName: 'subject' })
  declare subject: string | null

  @column({ columnName: 'content' })
  declare content: string

  @column({ columnName: 'content_type' })
  declare contentType: string

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @belongsTo(() => NotificationTemplate, {
    foreignKey: 'notificationTemplateId',
  })
  declare template: BelongsTo<typeof NotificationTemplate>

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'updated_at', autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime({ columnName: 'deleted_at' })
  declare deletedAt: DateTime | null
}
