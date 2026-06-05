import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class SyncTicketAux extends BaseCommand {
  static commandName = 'sync:ticket-aux'
  static description = 'Sincroniza tickets validados da tabela principal para as tabelas auxiliares'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🔄 Iniciando sincronização de tickets validados...')

    try {
      const validatedTickets = await db
        .from('tickets')
        .where('status', 'VALIDATED')
        .select('*')

      if (validatedTickets.length === 0) {
        this.logger.info('ℹ️  Nenhum ticket validado encontrado')
        return
      }

      this.logger.info(`📊 Encontrados ${validatedTickets.length} tickets validados`)

      let piraporaCount = 0
      let buritizeiroCount = 0

      for (const ticket of validatedTickets) {
        await this.syncTicketToAuxiliary(ticket)

        if (ticket.event_id === 1) {
          piraporaCount++
        } else if (ticket.event_id === 2) {
          buritizeiroCount++
        }
      }

      this.logger.success(
        `✅ Sincronização concluída! Pirapora: ${piraporaCount}, Buritizeiro: ${buritizeiroCount}`
      )
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido'
      this.logger.error(`❌ Erro ao sincronizar: ${msg}`)
      throw error
    }
  }

  private async syncTicketToAuxiliary(ticket: any): Promise<void> {
    try {
      const ticketNumber = ticket.ticket_number
      const numberPart = this.extractNumberPart(ticketNumber)
      let tableName: string
      let eventId: number

      if (ticket.event_id === 1) {
        tableName = 'tickets_pirapora'
        eventId = 1
      } else if (ticket.event_id === 2) {
        tableName = 'tickets_buritizeiro'
        eventId = 2
      } else {
        this.logger.warning(`⚠️  Event ID inválido para ticket ${ticketNumber}`)
        return
      }

      const whatsappMessage = await db
        .from('ticket_whatsapp_messages')
        .where('ticket_number', ticketNumber)
        .where('status', 'VALIDATED')
        .first()

      if (!whatsappMessage) {
        this.logger.warning(`⚠️  Mensagem WhatsApp não encontrada para ticket ${ticketNumber}`)
        return
      }

      const ticketMirror = `${whatsappMessage.message_id}.jpeg`

      const existingRecord = await db
        .from(tableName)
        .where('ticket_number', numberPart)
        .first()

      if (!existingRecord) {
        this.logger.warning(`⚠️  Ticket não encontrado em ${tableName}: ${numberPart}`)
        return
      }

      await db
        .from(tableName)
        .where('ticket_number', numberPart)
        .update({
          validated: 1,
          validated_on: ticket.validated_at,
          ticket_mirror: ticketMirror,
          updated_at: db.raw('now()'),
        })

      this.logger.info(`✓ Sincronizado: ${ticketNumber} → ${tableName}`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido'
      this.logger.error(`❌ Erro ao sincronizar ticket ${ticket.ticket_number}: ${msg}`)
    }
  }

  private extractNumberPart(ticketNumber: string): string {
    return ticketNumber.slice(2)
  }
}
