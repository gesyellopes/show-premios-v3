// commands/webhook_worker.ts
import { BaseCommand } from '@adonisjs/core/ace'
import redis from '@adonisjs/redis/services/main'
import app from '@adonisjs/core/services/app'
import WebhookTicketService from '../app/modules/ticket/services/webhook_service.ts'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class WebhookWorker extends BaseCommand {
  static commandName = 'webhook:worker'
  static description = 'Worker para processar a fila de webhooks'

  static options: CommandOptions = {
    startApp: true,
    staysAlive: true,
  }

  private running = true

  async run() {
    this.logger.info('🚀 Worker iniciado. Aguardando mensagens...')

    while (this.running) {
      try {
        // brpop remove e retorna o último elemento (Right)
        const result = await redis.brpop('webhook_queue', 20)
        if (!result) continue

        const [, messageId] = result

        const shouldRetry = await this.processMessage(messageId)

        if (shouldRetry) {
          this.logger.info(`🔄 Agendando reprocessamento para: ${messageId}`)

          // 1. ADICIONA NO INÍCIO (Left) para não ser lida imediatamente pelo brpop (Right)
          // Se a fila tiver mais itens, outros itens serão processados antes desta falha
          await redis.lpush('webhook_queue', messageId)

          // 2. REMOVA O TIMEOUT DAQUI. Se quiser dar um respiro, faça isso de forma
          // que não trave mensagens boas, ou use uma fila de delay dedicada.
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Erro desconhecido'
        this.logger.error(`❌ Erro no loop: ${msg}`)
      }
    }
  }

  private async processMessage(messageId: string): Promise<boolean> {
    try {
      this.logger.info(`⚙️  Iniciando processamento: ${messageId}`)

      const receiveService = await app.container.make(WebhookTicketService)
      const result = await receiveService.execute(messageId)

      if (result && result.retry === true) {
        this.logger.warning(
          `⚠️  Falha temporária em ${messageId}: ${result.error || 'Retry solicitado'}`
        )
        return true
      }

      this.logger.success(`✅ Finalizado: ${messageId}`)
      return false
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido'
      this.logger.error(`❌ Erro ao processar ${messageId}: ${msg}`)

      // IMPORTANTE: Idealmente verificar aqui se já passou do limite de retries
      // antes de retornar 'true' para não gerar loop infinito em erros fatais (ex: erro de sintaxe)
      return true
    }
  }
}
