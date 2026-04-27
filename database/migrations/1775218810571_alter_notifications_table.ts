import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("recipient_type", 100).after('notifiable_id')
      table.integer("recipient_id").after('recipient_type')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("recipient_type")
      table.dropColumn("recipient_id")
    })
  }
}