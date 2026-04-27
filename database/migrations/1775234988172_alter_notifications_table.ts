import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notification_template_item_translations'

  async up() {

    this.schema.alterTable(this.tableName, (table) => {

      table.integer('notification_template_item_id').unsigned().notNullable().after('tenant_id')
      table
        .foreign('notification_template_item_id', 'nt_tpi_fk')
        .references('id')
        .inTable('notification_template_items')
        .onDelete('CASCADE')

      table.timestamp('deleted_at').nullable().after('updated_at')

        
    })
  }

  async down() {

    this.schema.alterTable(this.tableName, (table) => {

      table.dropColumn('notification_template_item_id')
      table.dropColumn('deleted_at')


    })
  }
}