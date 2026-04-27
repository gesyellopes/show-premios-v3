import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('key', 150).notNullable().unique()
      table.text('value').nullable()
      table.string('type', 20).notNullable().defaultTo('string')
      table.string('group', 50).nullable()
      table.boolean('is_public').notNullable().defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}