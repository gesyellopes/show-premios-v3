import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notification_message_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('tenant_id').unsigned().notNullable()
      table.index(['tenant_id'], 'nml_tenant_idx')

      table.integer('notification_message_id').unsigned().notNullable()
      table
        .foreign('notification_message_id', 'nml_message_fk')
        .references('id')
        .inTable('notification_messages')
        .onDelete('CASCADE')

      table.string('type', 50).notNullable()
      table.index(['type'], 'nml_type_idx')

      table.string('status', 40).nullable()
      table.index(['status'], 'nml_status_idx')

      table.text('message').nullable()
      table.json('context').nullable()

      table.timestamp('created_at').notNullable()

      table.index(['tenant_id', 'notification_message_id'], 'nml_tenant_message_idx')
      table.index(['tenant_id', 'type'], 'nml_tenant_type_idx')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
