// commands/webhook_worker.ts
import { BaseCommand } from '@adonisjs/core/ace'
import redis from '@adonisjs/redis/services/main'
import app from '@adonisjs/core/services/app'
import WebhookTicketService from '../app/modules/ticket/services/webhook_service.ts'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class WebhookWorker extends BaseCommand {
  static commandName = 'webhook:worker'
  static description = 'Worker para processar a fila de webhooks'

  // ADICIONE ISSO: Força o Adonis a carregar os Providers (como o Drive)
  static options: CommandOptions = {
    startApp: true,
    staysAlive: true,
  }

  private running = true

  async run() {
    this.logger.info('🚀 Worker iniciado. Aguardando mensagens...')

    while (this.running) {
      try {
        // brpop aguarda até 20 segundos por uma mensagem (evita sobrecarga de CPU)
        const result = await redis.brpop('webhook_queue', 20)
        if (!result) continue

        // result no Adonis Redis retorna [key, value]
        const [, messageId] = result

        const shouldRetry = await this.processMessage(messageId)

        if (shouldRetry) {
          //this.logger.info(`🔄 Agendando reprocessamento para: ${messageId}`)
          // Devolvemos ao final da fila para processar outros antes de tentar este novamente
          await redis.rpush('webhook_queue', messageId)
          // Pequeno delay para não travar em erro persistente
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Erro desconhecido'
        this.logger.error(`❌ Erro no loop: ${msg}`)
      }
    }
  }

  /**
   * Processa a mensagem e retorna true se precisar de retry
   */
  private async processMessage(messageId: string): Promise<boolean> {
    try {
      //this.logger.info(`⚙️  Iniciando processamento: ${messageId}`)

      const receiveService = await app.container.make(WebhookTicketService)
      const result = await receiveService.execute(messageId)

      // console.log(result)

      if (result && result.retry === true) {
        /*
        this.logger.warning(
          `⚠️  Falha temporária em ${messageId}: ${result.error || 'Retry solicitado'}`
        )*/
        return true
      }

      //this.logger.success(`✅ Finalizado: ${messageId}`)
      return false
    } catch (error) {
      //const msg = error instanceof Error ? error.message : 'Erro desconhecido'
      //this.logger.error(`❌ Erro no ao processar: ${msg}`)
      return true // Erros de exceção sempre tentam novamente
    }
  }
}
