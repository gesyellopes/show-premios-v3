import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class DebugTicketNumbers extends BaseCommand {
  static commandName = 'debug:ticket-numbers'
  static description = 'Debug para verificar formato dos ticket_number'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🔍 Verificando formatos de ticket_number...')

    try {
      const piraporaSample = await db.from('tickets_pirapora').limit(3).select('*')
      this.logger.info('Amostra tickets_pirapora:')
      console.log(JSON.stringify(piraporaSample, null, 2))

      const ticketsSample = await db
        .from('tickets')
        .where('status', 'VALIDATED')
        .limit(3)
        .select('ticket_number', 'validated_at', 'status')
      this.logger.info('Amostra tickets (VALIDATED):')
      console.log(JSON.stringify(ticketsSample, null, 2))
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido'
      this.logger.error(`❌ Erro: ${msg}`)
    }
  }
}
