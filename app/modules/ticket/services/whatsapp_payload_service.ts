// app/modules/ticket/services/webhook_ticket_service.ts
import { wapi } from '#start/w-api'

interface ImageMessageMeta {
  mimetype: string
  directPath: string
  mediaKey: string
}

interface ImageMessageFull extends ImageMessageMeta {
  directPath: string
}

interface WapiMediaResponse {
  error: boolean
  fileLink: string
  expires: number
}

interface WhatsAppPayload {
  messageId?: string
  sender?: {
    id: string
    pushName: string
  }
  msgContent?: {
    imageMessage?: ImageMessageFull
    messageContextInfo?: {
      deviceListMetadata?: {
        senderTimestamp?: string | number
      }
    }
  }
}

export default class WebhookTicketService {
  /** Verifica se o payload contém uma mensagem de imagem */
  isImage(payload: WhatsAppPayload): boolean {
    return !!payload?.msgContent?.imageMessage
  }

  /** Extrai os metadados relevantes de uma mensagem de imagem. Retorna null se não for imagem */
  getImageMeta(payload: WhatsAppPayload): ImageMessageMeta | null {
    if (!this.isImage(payload)) return null

    const { mediaKey, mimetype, directPath } = payload.msgContent!.imageMessage!

    return { mediaKey, mimetype, directPath }
  }

  /**
   * Extrai informações básicas do payload mapeadas para nomes amigáveis.
   */
  getBasicInfo(payload: WhatsAppPayload) {
    return {
      whatsappMessageId: payload.messageId,
      senderNumber: payload.sender?.id,
      senderName: payload.sender?.pushName,
      sentAt: payload.msgContent?.messageContextInfo?.deviceListMetadata?.senderTimestamp,
    }
  }

  /**
   * Solicita ao wapi a URL temporária de download da mídia.
   * O wapi pode retornar um Buffer com JSON serializado, uma string JSON ou o objeto diretamente —
   * os três casos são normalizados antes da validação.
   */
  async getMediaLink(payload: WhatsAppPayload): Promise<string> {
    const meta = this.getImageMeta(payload)

    if (!meta) {
      throw new Error('[WebhookTicketService] payload não contém imageMessage')
    }

    const raw = await wapi.downloadMedia({
      mediaKey: meta.mediaKey,
      directPath: meta.directPath,
      type: 'image',
      mimetype: meta.mimetype,
    })

    const result: WapiMediaResponse = Buffer.isBuffer(raw)
      ? JSON.parse(raw.toString('utf-8'))
      : typeof raw === 'string'
        ? JSON.parse(raw)
        : (raw as WapiMediaResponse)

    if (result.error || !result.fileLink) {
      throw new Error(
        `[WebhookTicketService] wapi não retornou fileLink: ${JSON.stringify(result)}`
      )
    }

    return result.fileLink
  }
}
