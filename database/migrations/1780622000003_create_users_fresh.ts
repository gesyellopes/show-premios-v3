import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('uuid').unique().notNullable()
      table.string('name', 255).notNullable()
      table.string('email', 255).unique().notNullable()
      table.string('phone', 20)
      table.string('password').notNullable()
      table.enum('role', ['admin', 'manager', 'vendor']).defaultTo('vendor')
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
