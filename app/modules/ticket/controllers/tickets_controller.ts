import redis from '@adonisjs/redis/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import { ulid } from 'ulid'
import { inject } from '@adonisjs/core'
import TicketService from '../services/ticket_service.ts'
import TicketWhatsappService from '../services/ticket_whatsapp_messages_service.ts'
import WebhookService from '../services/webhook_service.ts'
import S3Storage from '../../../modules/storage/services/s3_service.ts' // ✅ Importe seu novo serviço
import { Readable } from 'node:stream' // ✅ Para converter JSON em Stream

@inject()
export default class TicketsController {
  constructor(
    protected ticketService: TicketService,
    protected webhookService: WebhookService,
    protected s3Storage: S3Storage,
    protected ticketWhatsappService: TicketWhatsappService
  ) {}

  async webhook({ request, response }: HttpContext) {
    const messageId = ulid()
    const payload = request.all()

    try {
      // 1. Converter o JSON em um Stream para o S3 (Zero-Footprint)
      const jsonString = JSON.stringify(payload, null, 2)
      const stream = Readable.from([jsonString])
      const size = Buffer.byteLength(jsonString)

      // 2. Salvar no S3 Private
      // Caminho sugerido: webhooks/ano/mes/dia/id.json
      const s3Path = `webhooks/whatsapp-messages/${messageId}.json`

      /** * IMPORTANTE: Como seu S3Storage.upload espera um MultipartFile,
       * você pode criar um método 'uploadRaw' ou adaptar o atual.
       * Vou assumir que você adicionou suporte a Stream no S3Storage.
       */
      await this.s3Storage.putRawStream(s3Path, stream, 'application/json', size, true)
      // 4. Empilha no Redis
      await redis.lpush('webhook_queue', messageId)

      console.log({
         id: messageId,
         info: 'Payload em S3, Banco e Fila.',
      })

      return response.created()
    } catch (error: any) {
      return response.internalServerError({
        message: 'Erro ao processar webhook',
        error: error.message,
      })
    }
  }

  async getFile({ response }: HttpContext) {
    const file = `webhooks/whatsapp-messages/01KPTWPS59ZXC813EYZ898ZQKW.json`
    const url = await this.s3Storage.getUrl(file, true)

    return response.json({ url: url })
  }

  //Teste para processar mensagem
  async messageExecute({ request, response }: HttpContext) {
    const fileId = request.params().fileId
    const execute = await this.webhookService.execute(fileId)
    return response.json(execute)
  }

  /**
   * Cria tickets em lote para um evento.
   * Espera no body: eventId, prefix, volume, status (opcional)
   */
  async bulkCreate({ request, response }: HttpContext) {
    const data = request.only(['eventId', 'prefix', 'volume', 'status'])

    const tickets = await this.ticketService.bulkCreate(data)

    return response.created(tickets)
  }

  /**
   * Lista as mensagens na fila ou limpa a fila se 'delete: true' for passado.
   */
  async manageQueue({ request, response }: HttpContext) {
    const shouldDelete = request.input('delete')

    if (shouldDelete === true || shouldDelete === 'true') {
      await redis.del('webhook_queue')
      return response.ok({ message: 'Fila de webhooks limpa com sucesso.' })
    }

    const messages = await redis.lrange('webhook_queue', 0, -1)
    return response.ok({ total: messages.length, messages })
  }

  /** Verifica se uma cartela já está validada ou não */
  async verifyTicket({ request, response }: HttpContext) {
    const ticketNumber = request.params().ticketNumber
    const isValidated = await this.ticketWhatsappService.isTicketValidated(ticketNumber)
    return response.ok({ success: true, valid: isValidated })
  }
}
