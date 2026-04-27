import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_meta'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('key', 100).notNullable()
      table.text('value').nullable()
      table.string('type', 30).notNullable().defaultTo('string')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['user_id', 'key'])
      table.index(['key'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}