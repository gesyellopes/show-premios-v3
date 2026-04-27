import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notification_template_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('channel', 50).alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('channel', 255).alter()
    })
  }
}