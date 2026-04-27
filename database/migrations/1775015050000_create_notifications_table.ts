import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('tenant_id').unsigned().notNullable()
      table.index(['tenant_id'], 'n_tenant_idx')

      table.integer('template_id').unsigned().nullable()
      table
        .foreign('template_id', 'n_template_fk')
        .references('id')
        .inTable('notification_templates')
        .onDelete('SET NULL')

      table.string('event_key', 120).notNullable()
      table.index(['event_key'], 'n_event_idx')

      table.string('notifiable_type', 100).nullable()
      table.integer('notifiable_id').unsigned().nullable()

      table.string('recipient', 255).notNullable()
      table.string('recipient_name', 150).nullable()

      table.json('payload').nullable()

      table.string('status', 40).notNullable().defaultTo('pending')
      table.index(['status'], 'n_status_idx')

      table.integer('priority').notNullable().defaultTo(0)
      table.index(['priority'], 'n_priority_idx')

      table.timestamp('scheduled_at').nullable()
      table.timestamp('sent_at').nullable()
      table.timestamp('failed_at').nullable()

      table.integer('created_by').unsigned().nullable()
      table.string('system_key', 100).nullable()
      table.index(['system_key'], 'n_system_key_idx')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()

      table.index(['tenant_id', 'event_key'], 'n_tenant_event_idx')
      table.index(['tenant_id', 'status'], 'n_tenant_status_idx')
      table.index(['tenant_id', 'scheduled_at'], 'n_tenant_sched_idx')
      table.index(['tenant_id', 'notifiable_type', 'notifiable_id'], 'n_tenant_notifiable_idx')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
