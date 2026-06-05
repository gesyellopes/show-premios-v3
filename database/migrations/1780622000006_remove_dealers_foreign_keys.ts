import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'dealers'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('event_id')
      table.dropForeign('user_id')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE')
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }
}
