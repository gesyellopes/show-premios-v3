import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('distributor_id').unsigned().nullable().after('event_id')
      table.integer('vendor_id').unsigned().nullable().after('distributor_id')
      table.integer('distributor_category_id').unsigned().nullable().after('vendor_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('distributor_id')
      table.dropColumn('vendor_id')
      table.dropColumn('distributor_category_id')
    })
  }
}
