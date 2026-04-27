import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'person_meta'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('person_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('persons')
        .onDelete('CASCADE')

      table.string('key', 100).notNullable()
      table.text('value').nullable()
      table.string('type', 30).notNullable().defaultTo('string')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['person_id', 'key'])
      table.index(['key'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}