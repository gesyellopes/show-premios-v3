import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class UpdateValidatedOn extends BaseCommand {
  static commandName = 'update:validated-on'
  static description = 'Atualiza validated_on dos registros já sincronizados baseado em validated_at da tabela tickets'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('📅 Atualizando validated_on dos registros sincronizados...')

    try {
      await this.updatePirapora()
      await this.updateBuritizeiro()
      this.logger.success('✅ Atualização concluída!')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido'
      this.logger.error(`❌ Erro ao atualizar validated_on: ${msg}`)
      throw error
    }
  }

  private async updatePirapora(): Promise<void> {
    this.logger.info('📍 Processando Pirapora...')

    const validatedPirapora = await db
      .from('tickets')
      .where('status', 'VALIDATED')
      .whereRaw(`LEFT(ticket_number, 2) = 'AB'`)
      .select('ticket_number', 'validated_at')

    let updated = 0
    for (const ticket of validatedPirapora) {
      const numberPart = ticket.ticket_number.slice(2)
      await db
        .from('tickets_pirapora')
        .where('ticket_number', numberPart)
        .update({
          validated_on: ticket.validated_at,
        })
      updated++
    }

    this.logger.success(`✅ ${updated} registros atualizados em Pirapora`)
  }

  private async updateBuritizeiro(): Promise<void> {
    this.logger.info('🏘️  Processando Buritizeiro...')

    const validatedBuritizeiro = await db
      .from('tickets')
      .where('status', 'VALIDATED')
      .whereRaw(`LEFT(ticket_number, 2) = 'AC'`)
      .select('ticket_number', 'validated_at')

    let updated = 0
    for (const ticket of validatedBuritizeiro) {
      const numberPart = ticket.ticket_number.slice(2)
      await db
        .from('tickets_buritizeiro')
        .where('ticket_number', numberPart)
        .update({
          validated_on: ticket.validated_at,
        })
      updated++
    }

    this.logger.success(`✅ ${updated} registros atualizados em Buritizeiro`)
  }
}
