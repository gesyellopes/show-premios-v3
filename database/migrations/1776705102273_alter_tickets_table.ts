import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ticket_whatsapp_messages'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('attempts').nullable().after('whatsapp_message_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('attempts')
    })
  }
}
