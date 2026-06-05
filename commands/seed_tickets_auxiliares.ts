import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class SeedTicketsAuxiliares extends BaseCommand {
  static commandName = 'seed:tickets-auxiliares'
  static description = 'Popula as tabelas auxiliares tickets_pirapora e tickets_buritizeiro'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🌱 Iniciando seed das tabelas auxiliares...')

    const now = DateTime.now().toSQL({ includeOffset: false })
    const trx = await db.transaction()

    try {
      await this.seedPirapora(trx, now)
      await this.seedBuritizeiro(trx, now)
      await trx.commit()
      this.logger.success('✅ Seed concluído com sucesso!')
    } catch (error) {
      await trx.rollback()
      const msg = error instanceof Error ? error.message : 'Erro desconhecido'
      this.logger.error(`❌ Erro ao fazer seed: ${msg}`)
      throw error
    }
  }

  private async seedPirapora(trx: any, now: string) {
    this.logger.info('📍 Gerando 6000 registros para Pirapora...')

    const records = []
    for (let i = 1; i <= 6000; i++) {
      records.push({
        ticket_number: i.toString().padStart(6, '0'),
        event_id: 1,
        delivered_on: now,
        validated: 0,
        created_at: now,
        updated_at: now,
      })
    }

    const chunkSize = 1000
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize)
      await db.table('tickets_pirapora').useTransaction(trx).multiInsert(chunk)
    }

    this.logger.success(`✅ 6000 registros inseridos em tickets_pirapora`)
  }

  private async seedBuritizeiro(trx: any, now: string) {
    this.logger.info('🏘️  Gerando 7000 registros para Buritizeiro...')

    const records = []
    for (let i = 1; i <= 7000; i++) {
      records.push({
        ticket_number: i.toString().padStart(6, '0'),
        event_id: 2,
        delivered_on: now,
        validated: 0,
        created_at: now,
        updated_at: now,
      })
    }

    const chunkSize = 1000
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize)
      await db.table('tickets_buritizeiro').useTransaction(trx).multiInsert(chunk)
    }

    this.logger.success(`✅ 7000 registros inseridos em tickets_buritizeiro`)
  }
}
