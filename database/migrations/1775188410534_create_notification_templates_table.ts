import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notification_templates'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('group').after('description')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) =>{
      table.dropColumn('group')
    })
  }
}