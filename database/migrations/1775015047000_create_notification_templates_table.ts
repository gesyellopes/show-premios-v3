import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notification_templates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('tenant_id').unsigned().notNullable()
      table.index(['tenant_id'], 'nt_tenant_idx')

      table.string('key', 120).notNullable()
      table.string('name', 150).notNullable()
      table.text('description').nullable()

      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()

      table.unique(['tenant_id', 'key'], 'nt_tenant_key_uq')
      table.index(['tenant_id', 'is_active'], 'nt_tenant_active_idx')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
