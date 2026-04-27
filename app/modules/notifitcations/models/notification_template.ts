
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import NotificationTemplateChannel from './notification_template_channel.js'

export default class NotificationTemplate extends BaseModel {
  public static table = 'notification_templates'

  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column({ columnName: 'tenant_id' })
  declare tenantId: number

  @column({ columnName: 'key' })
  declare key: string

  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'description' })
  declare description: string | null

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @hasMany(() => NotificationTemplateChannel, {
    foreignKey: 'notificationTemplateId',
  })
  declare channels: HasMany<typeof NotificationTemplateChannel>

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'updated_at', autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime({ columnName: 'deleted_at' })
  declare deletedAt: DateTime | null
}
