import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    const hasTable = await this.schema.hasTable(this.tableName)

    if (hasTable) {
      // Desabilita foreign keys, faz drop e reabilita
      this.schema.raw('SET FOREIGN_KEY_CHECKS = 0')
      this.schema.raw(`DROP TABLE IF EXISTS ${this.tableName}`)
      this.schema.raw('SET FOREIGN_KEY_CHECKS = 1')
    }

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
    this.schema.raw('SET FOREIGN_KEY_CHECKS = 0')
    this.schema.dropTable(this.tableName)
    this.schema.raw('SET FOREIGN_KEY_CHECKS = 1')
  }
}
