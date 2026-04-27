import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notification_template_channel_items'

  async up() {
    this.schema.dropTable(this.tableName)
  }

  async down() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('tenant_id').unsigned().notNullable().index()

      table.integer('notification_template_channel_id').unsigned().notNullable()
      table
        .foreign('notification_template_channel_id', 'ntci_channel_fk')
        .references('id')
        .inTable('notification_template_channels')
        .onDelete('CASCADE')

      table.string('type', 50).notNullable().index()

      table.string('subject', 255).nullable()
      table.text('content').nullable()
      table.string('content_type', 30).nullable()

      table.text('media_url').nullable()
      table.string('media_type', 100).nullable()
      table.text('caption').nullable()

      table.integer('sort_order').notNullable().defaultTo(1)
      table.integer('delay_ms').notNullable().defaultTo(0)

      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }
}