import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'agents'

  async up() {
    const hasTable = await this.schema.hasTable(this.tableName)

    if (hasTable) {
      this.schema.raw('SET FOREIGN_KEY_CHECKS = 0')
      this.schema.raw(`DROP TABLE IF EXISTS ${this.tableName}`)
      this.schema.raw('SET FOREIGN_KEY_CHECKS = 1')
    }

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('uuid').unique().notNullable()
      table.integer('event_id').unsigned().notNullable()
      table.string('name', 255).notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.timestamps(true, true)

      table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE')
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.raw('SET FOREIGN_KEY_CHECKS = 0')
    this.schema.dropTable(this.tableName)
    this.schema.raw('SET FOREIGN_KEY_CHECKS = 1')
  }
}
