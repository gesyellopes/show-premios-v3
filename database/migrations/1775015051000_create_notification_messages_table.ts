import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notification_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('tenant_id').unsigned().notNullable()
      table.index(['tenant_id'], 'nm_tenant_idx')

      table.integer('notification_id').unsigned().notNullable()
      table
        .foreign('notification_id', 'nm_notification_fk')
        .references('id')
        .inTable('notifications')
        .onDelete('CASCADE')

      table.string('channel', 50).notNullable()
      table.index(['channel'], 'nm_channel_idx')

      table.string('provider', 80).nullable()
      table.index(['provider'], 'nm_provider_idx')

      table.string('to', 255).notNullable()
      table.string('subject', 255).nullable()
      table.text('content').notNullable()

      table.json('rendered_payload').nullable()

      table.string('status', 40).notNullable().defaultTo('pending')
      table.index(['status'], 'nm_status_idx')

      table.string('external_id', 255).nullable()
      table.index(['external_id'], 'nm_external_idx')

      table.json('provider_response').nullable()

      table.integer('attempts').notNullable().defaultTo(0)
      table.integer('retry_limit').notNullable().defaultTo(3)
      table.timestamp('next_retry_at').nullable()
      table.timestamp('last_attempt_at').nullable()

      table.string('provider_config_tag', 100).nullable()
      table.index(['provider_config_tag'], 'nm_provider_tag_idx')

      table.timestamp('sent_at').nullable()
      table.timestamp('failed_at').nullable()
      table.timestamp('delivered_at').nullable()
      table.timestamp('read_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()

      table.index(['tenant_id', 'notification_id'], 'nm_tenant_notification_idx')
      table.index(['tenant_id', 'channel', 'status'], 'nm_tenant_channel_status_idx')
      table.index(['tenant_id', 'next_retry_at'], 'nm_tenant_retry_idx')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
