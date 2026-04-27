import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('tag', 100).nullable().after('group')
      table.index(['group', 'tag'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['group', 'tag'])
      table.dropColumn('tag')
    })
  }
}