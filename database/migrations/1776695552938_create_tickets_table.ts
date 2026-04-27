import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').notNullable().unique()
      table.integer('event_id').unsigned().notNullable() // Relacionamento com evento
      table.string('ticket_number').notNullable().unique()
      table.string('status').notNullable().defaultTo('WAITING_PRINT')
      table.string('validation_code').nullable().unique() // ULID

      table.timestamp('validated_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
