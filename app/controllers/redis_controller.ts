import redis from '@adonisjs/redis/services/main'
import { wapi } from '#start/w-api' // Importe a instância criada no passo 1
import type { HttpContext } from '@adonisjs/core/http'
import { ulid } from 'ulid'

export default class RedisController {
  /**
   * WEBHOOK
   * Apenas gera o ID e empilha na lista 'webhook_queue'
   */
  async simulateWebhook({ response }: HttpContext) {
    const messageId = ulid()

    // O valor guardado é apenas a string do ID
    await redis.lpush('webhook_queue', messageId)

    return response.created({
      id: messageId,
      info: 'ID adicionado à fila de processamento',
    })
  }

  /**
   * LER TODOS OS IDs NA FILA
   * Como é uma lista, usamos o comando LRANGE
   */
  async index({ response }: HttpContext) {
    /*
    // LRANGE nome_da_chave inicio fim
    // 0 é o primeiro, -1 é o último (lê a lista toda)
    const queueItems = await redis.lrange('webhook_queue', 0, -1)

    return response.ok({
      total_na_fila: queueItems.length,
      ids: queueItems,
    })

    */

    //Mandar mensagem teste
    try {
      const sendMessage = await wapi.sendText({
        phone: '5538984122792',
        message: 'Teste API',
        // delayMessage: 2 (opcional)
      })

      return response.ok({
        success: true,
        messageId: sendMessage.messageId,
      })
    } catch (error) {
      return response.badRequest({
        error: 'Erro ao enviar mensagem via W-API',
        details: error.message,
      })
    }
  }

  /**
   * DELETAR UM ID ESPECÍFICO DA FILA
   */
  async destroy({ request, response }: HttpContext) {
    const id = request.input('id')

    if (!id) {
      return response.badRequest({ message: 'ID é obrigatório' })
    }

    // LREM remove itens específicos de uma lista
    // O '0' significa: remova todas as ocorrências desse ID
    const removedCount = await redis.lrem('webhook_queue', 0, id)

    if (removedCount === 0) {
      return response.notFound({ message: 'ID não encontrado na fila' })
    }

    return response.ok({ message: `ID ${id} removido da fila.` })
  }
}
