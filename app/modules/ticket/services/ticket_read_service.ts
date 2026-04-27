import { inject } from '@adonisjs/core'
import env from '#start/env'
import axios from 'axios'

@inject()
export default class TicketReadService {
  private readonly baseUrl = env.get('QRCODE_API_URL')

  /**
   * Lê um QR Code a partir de um arquivo já existente no Storage
   * @param filename Nome do arquivo (ex: 'tickets/01KQ...jpeg')
   */
  async readQRCode(filename: string) {
    // Encode do filename para evitar problemas com barras ou espaços na URL
    const encodedFilename = encodeURIComponent(filename)
    const url = `${this.baseUrl}/read-qr/${encodedFilename}`

    try {
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
        },
        timeout: 10000, // 10 segundos é um tempo seguro para leitura de imagem
      })

      // Se o axios não caiu no catch, o status é 2xx
      return response.data
    } catch (error: any) {
      // 1. Se a API externa respondeu com erro (4xx, 5xx)
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message: 'A API de QR Code retornou um erro.',
          data: error.response.data,
        }
      }

      // 2. Se a requisição foi feita mas não houve resposta (timeout/rede)
      if (error.request) {
        return {
          success: false,
          message: 'Sem resposta da API de QR Code. Verifique a conexão ou timeout.',
          error: error.message,
        }
      }

      // 3. Erros genéricos de configuração
      return {
        success: false,
        message: 'Falha ao configurar a requisição de leitura de QR Code',
        error: error.message,
      }
    }
  }
}
