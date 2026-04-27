import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notification_template_channels'

  async up() {
    this.schema.dropTable(this.tableName)
  }

  async down() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('tenant_id').unsigned().notNullable()
      table.index(['tenant_id'], 'ntc_tenant_idx')

      table.integer('notification_template_id').unsigned().notNullable()
      table
        .foreign('notification_template_id', 'ntc_template_fk')
        .references('id')
        .inTable('notification_templates')
        .onDelete('CASCADE')

      table.string('channel', 50).notNullable()
      table.index(['channel'], 'ntc_channel_idx')

      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()

      table.unique(['notification_template_id', 'channel'], 'ntc_tpl_channel_uq')
      table.index(['tenant_id', 'channel'], 'ntc_tenant_channel_idx')
      table.index(['tenant_id', 'is_active'], 'ntc_tenant_active_idx')
    })
  }
}