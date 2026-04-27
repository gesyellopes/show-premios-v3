import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ticket_whatsapp_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('validation_code').notNullable() // ULID para vincular ao ticket
      table.string('sender_number').notNullable()
      table.string('sender_name').nullable()
      table.timestamp('sent_at').notNullable()
      table.string('whatsapp_message_id').notNullable().unique()
      table.string('filename').nullable()
      table.string('ticket_number').nullable()
      table.string('status').notNullable().defaultTo('RECEIVED')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
