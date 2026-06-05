import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    await this.schema.createTable('tickets_pirapora', (table) => {
      table.bigIncrements('id').primary()
      table.string('ticket_number', 8).notNullable()
      table.bigInteger('event_id').unsigned().notNullable()
      table.bigInteger('organization_id').unsigned().nullable()
      table.bigInteger('unit_id').unsigned().nullable()
      table.bigInteger('group_id').unsigned().nullable()
      table.bigInteger('vendor_id').unsigned().nullable()
      table.dateTime('delivered_on').nullable()
      table.tinyint('validated').defaultTo(0)
      table.string('ticket_mirror', 200).nullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())

      table.index('ticket_number')
      table.index('event_id')
    })

    await this.schema.createTable('tickets_buritizeiro', (table) => {
      table.bigIncrements('id').primary()
      table.string('ticket_number', 8).notNullable()
      table.bigInteger('event_id').unsigned().notNullable()
      table.bigInteger('organization_id').unsigned().nullable()
      table.bigInteger('unit_id').unsigned().nullable()
      table.bigInteger('group_id').unsigned().nullable()
      table.bigInteger('vendor_id').unsigned().nullable()
      table.dateTime('delivered_on').nullable()
      table.tinyint('validated').defaultTo(0)
      table.string('ticket_mirror', 200).nullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())

      table.index('ticket_number')
      table.index('event_id')
    })
  }

  async down() {
    await this.schema.dropTable('tickets_pirapora')
    await this.schema.dropTable('tickets_buritizeiro')
  }
}
