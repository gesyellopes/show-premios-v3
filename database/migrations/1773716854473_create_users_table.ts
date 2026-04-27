import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.uuid('uuid').notNullable().unique()

      table
        .integer('person_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('persons')
        .onDelete('SET NULL')

      table.string('username', 80).nullable().unique()
      table.string('email', 150).nullable().unique()
      table.string('phone', 30).nullable().unique()

      table.string('password', 255).notNullable()

      table.string('status', 30).notNullable().defaultTo('active')

      table.timestamp('last_login_at').nullable()
      table.timestamp('email_verified_at').nullable()
      table.timestamp('phone_verified_at').nullable()

      table.string('remember_me_token', 255).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()

      table.index(['person_id'])
      table.index(['status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
