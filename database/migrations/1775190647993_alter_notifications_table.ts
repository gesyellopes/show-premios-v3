import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notification_template_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string('uuid', 36)
        .after('id')
        .notNullable()
        .unique()
        .index()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('uuid')
    })
  }
}