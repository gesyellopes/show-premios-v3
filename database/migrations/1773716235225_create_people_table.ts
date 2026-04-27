import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'persons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.uuid('uuid').notNullable().unique()

      table.string('full_name', 150).notNullable()
      table.string('display_name', 150).nullable()

      table.date('birth_date').nullable()
      table.string('phone', 30).nullable()
      table.string('email', 150).nullable()

      table.string('gender', 30).nullable()
      table.string('status', 30).notNullable().defaultTo('active')

      table.text('notes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()

      table.index(['full_name'])
      table.index(['email'])
      table.index(['phone'])
      table.index(['status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}