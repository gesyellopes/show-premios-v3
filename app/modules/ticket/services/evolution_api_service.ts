import env from '#start/env'

interface SendTextPayload {
  number: string
  text: string
  quoted?: {
    key: {
      id: string
      remoteJid: string
      fromMe: boolean
    }
  }
}

export default class EvolutionApiService {
  private baseUrl: string
  private instance: string
  private apiKey: string

  constructor() {
    this.baseUrl = env.get('EVOLUTION_API_URL', 'https://w-api.projectgrid.cloud')
    this.instance = env.get('EVOLUTION_INSTANCE', 'dev-gesyel')
    this.apiKey = env.get('EVOLUTION_API_KEY', '')
  }

  async sendText(payload: SendTextPayload): Promise<any> {
    const url = `${this.baseUrl}/message/sendText/${this.instance}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': this.apiKey, // Mudança aqui: usando o nome exato esperado pela API
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Evolution API Error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Falha ao enviar mensagem via Evolution API: ${error.message}`)
    }
  }
}
