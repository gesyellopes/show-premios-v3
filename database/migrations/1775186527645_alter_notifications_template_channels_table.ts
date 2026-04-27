import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notification_template_channels'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      //Removo colunas do banco
      table.dropColumn('subject')
      table.dropColumn('content')
      table.dropColumn('content_type')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('subject', 255).nullable()
      table.text('content').notNullable()
      table.string('content_type', 30).notNullable().defaultTo('text')
    })
  }
}