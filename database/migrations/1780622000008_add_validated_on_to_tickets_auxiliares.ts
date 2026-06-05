import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    await this.schema.table('tickets_pirapora', (table) => {
      table.dateTime('validated_on').nullable().after('validated')
    })

    await this.schema.table('tickets_buritizeiro', (table) => {
      table.dateTime('validated_on').nullable().after('validated')
    })
  }

  async down() {
    await this.schema.table('tickets_pirapora', (table) => {
      table.dropColumn('validated_on')
    })

    await this.schema.table('tickets_buritizeiro', (table) => {
      table.dropColumn('validated_on')
    })
  }
}
