import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notification_template_item_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .string('uuid', 36)
        .notNullable()
        .unique()
        .index()
    
      table.integer('tenant_id').unsigned().notNullable().index()

      table.integer('notification_template_id').unsigned().notNullable()
      table
        .foreign('notification_template_id', 'nt_tpl__fk')
        .references('id')
        .inTable('notification_templates')
        .onDelete('CASCADE')

      table.string('locale', 10).notNullable()
      table.string('subject', 255).nullable()
      table.text('content').nullable()
      table.text('media_url').nullable()
      table.text('caption').nullable()


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}