// app/modules/ticket/services/receive_ticket_service.ts
import env from '#start/env'
import { inject } from '@adonisjs/core'
import WhatsAppPayloadService from './whatsapp_payload_service.ts'
import TicketWhatsappService from './ticket_whatsapp_messages_service.ts'
import S3Storage from '../../../modules/storage/services/s3_service.ts'
import TicketReadService from './ticket_read_service.ts'
import { TICKET_CODES } from '../constants/index.ts'
import { wapi } from '#start/w-api'
import i18n from '@adonisjs/i18n/services/main'

interface TicketPayload {
  whatsappMessageId?: string
  senderNumber?: string
  senderName?: string
  sentAt?: string | number
  fileName: string
  messageId: string
}

type ServiceResult = {
  retry: boolean
  error?: string
  reason?: string
  success?: boolean
  details?: string
  [key: string]: unknown
}

@inject()
export default class WebhookTicketService {
  protected i18n = i18n.locale(i18n.defaultLocale)

  constructor(
    protected whatsAppPayloadService: WhatsAppPayloadService,
    protected ticketWhatsappService: TicketWhatsappService,
    protected s3Storage: S3Storage,
    protected ticketReadService: TicketReadService
  ) {}

  /**
   * Processa uma mensagem recebida pelo WhatsApp.
   * Na primeira execução, resolve o payload do S3 e faz upload da imagem.
   * Em reprocessamentos, usa os dados já persistidos no banco.
   */
  async execute(messageId: string): Promise<ServiceResult> {
    try {
      const messageBD = await this.ticketWhatsappService.findByCode(messageId)

      if (!messageBD) {
        return await this.processFirstExecution(messageId)
      }

      if (messageBD.status === 'VALIDATED' || messageBD.attempts >= env.get('MAX_ATTEMPTS')) {
        return { retry: false, error: TICKET_CODES.ALREADY_VALIDATED }
      }

      const raw = this.ticketWhatsappService.preparePayload(messageBD)
      const payload: TicketPayload = {
        messageId: raw.messageId,
        fileName: raw.fileName ?? '',
        whatsappMessageId: raw.whatsappMessageId ?? undefined,
        senderNumber: raw.senderNumber ?? undefined,
        senderName: raw.senderName ?? undefined,
        sentAt: raw.sentAt ?? undefined,
      }
      return await this.readTicket(payload, { alreadyPersisted: true })
    } catch (error: any) {
      // console.error(`[WebhookTicketService] Falha ao processar ticket ${messageId}:`, error.message)
      throw error
    }
  }

  /**
   * Primeira execução: busca payload no S3, valida se é imagem,
   * faz upload e encaminha para leitura do QR Code.
   */
  private async processFirstExecution(messageId: string): Promise<ServiceResult> {
    const s3Path = `webhooks/whatsapp-messages/${messageId}.json`
    const content = await this.s3Storage.getContent(s3Path, true)

    if (!content) {
      return { retry: false, error: 'PAYLOAD_NOT_FOUND' }
    }

    const payload = JSON.parse(content)

    if (!this.whatsAppPayloadService.isImage(payload)) {
      return { retry: false, error: 'IS_NOT_IMAGE' }
    }

    const mediaLink = await this.whatsAppPayloadService.getMediaLink(payload)
    if (!mediaLink) {
      return { retry: true, error: 'ERROR_DOWNLOAD_MEDIA' }
    }

    const uploadPayload = await this.s3Storage.uploadFromUrl(mediaLink, {
      path: 'tickets',
      fileName: messageId,
    })

    if (!uploadPayload) {
      return { retry: true, error: 'ERROR_UPLOAD_MEDIA' }
    }

    const ticketPayload: TicketPayload = {
      ...this.whatsAppPayloadService.getBasicInfo(payload),
      fileName: uploadPayload.storageFileName,
      messageId,
    }

    return await this.readTicket(ticketPayload, { alreadyPersisted: false })
  }

  /**
   * Persiste a mensagem (se necessário), lê o QR Code e valida o ticket.
   */
  private async readTicket(
    payload: TicketPayload,
    options: { alreadyPersisted: boolean }
  ): Promise<ServiceResult> {
    if (!options.alreadyPersisted) {
      try {
        await this.ticketWhatsappService.processIncomingMessage({
          messageId: payload.messageId,
          senderNumber: payload.senderNumber!,
          whatsappMessageId: payload.whatsappMessageId!,
          senderName: payload.senderName,
          filename: payload.fileName,
          sentAt: payload.sentAt,
          attempts: 0,
        })
      } catch (error: any) {
        return { retry: true, error: 'ERROR_SAVE_MESSAGE', details: error.message }
      }
    }

    const qrCode = await this.readQRCode(payload.fileName)

    if (qrCode.error) {
      return { retry: true, error: qrCode.error, details: qrCode.details }
    }

    const attempts = await this.ticketWhatsappService.incrementAttempts(payload.messageId)

    //Aqui quero lançar uma verificação se o ticket_id realmente existe, se não existir chamo o handle de Failure passando o motivo INVALID_QRCODE
    if (qrCode.ticket_id) {
      const hasTicket = await this.ticketWhatsappService.findTicket(qrCode.ticket_id)
      //console.log(`Retorno do QRCODE ${qrCode.ticket_id}`)
      //console.log(`Retorno do Ticket ${hasTicket}`)
      if (!hasTicket) {
        return await this.handleFailure(payload, 'INVALID_QRCODE', attempts)
      }
    }

    if (qrCode.success && qrCode.ticket_id) {
      const isValidated = await this.ticketWhatsappService.isTicketValidated(qrCode.ticket_id)
      if (isValidated) {
        return await this.handleAlreadyValidated(payload, qrCode.ticket_id)
      }
      return await this.handleSuccess(payload, qrCode)
    }

    return await this.handleFailure(payload, qrCode.reason, attempts)
  }

  /**
   * Ticket já foi validado por outra mensagem. Notifica o remetente.
   */
  private async handleAlreadyValidated(
    payload: TicketPayload,
    ticketId: string
  ): Promise<ServiceResult> {
    const ticketCode = ticketId.slice(2)

    await this.ticketWhatsappService.updateStatus(payload.messageId, 'VALIDATED', ticketId)
    await wapi.sendText({
      phone: payload.senderNumber!,
      message: this.i18n.t('ticket.ticket_already_validated', { ticketCode }),
      messageId: payload.whatsappMessageId,
    })

    return { retry: false, error: TICKET_CODES.ALREADY_VALIDATED }
  }

  /**
   * QR Code lido com sucesso. Valida o ticket e notifica o remetente.
   */
  private async handleSuccess(payload: TicketPayload, qrCode: any): Promise<ServiceResult> {
    const ticketCode = qrCode.ticket_id.slice(2)

    const validate = await this.ticketWhatsappService.approveValidation({
      messageId: payload.messageId,
      ticketNumber: qrCode.ticket_id,
    })

    await wapi.sendText({
      phone: payload.senderNumber!,
      message: this.i18n.t('ticket.ticket_success', { ticketCode }),
      messageId: payload.whatsappMessageId,
    })

    return { retry: false, success: true, ...validate }
  }

  /**
   * Falha na leitura do QR Code. Se atingiu o limite de tentativas, notifica o remetente.
   */
  private async handleFailure(
    payload: TicketPayload,
    reason: string,
    attempts: number
  ): Promise<ServiceResult> {
    await this.ticketWhatsappService.updateStatus(payload.messageId, reason)

    if (attempts < env.get('MAX_ATTEMPTS')) {
      return { retry: true, error: TICKET_CODES.ERROR_FILE_DELETED }
    }

    const messageKey = this.resolveFailureMessageKey(reason)
    //console.log(this.i18n.t(messageKey))
    await wapi.sendText({
      phone: payload.senderNumber!,
      message: this.i18n.t(messageKey),
      messageId: payload.whatsappMessageId,
    })

    return { retry: false, error: TICKET_CODES.MAX_ATTEMPTS, reason }
  }

  /**
   * Mapeia o motivo da falha para a chave de tradução correspondente.
   */
  private resolveFailureMessageKey(reason: string): string {
    const map: Record<string, string> = {
      NO_QRCODE: 'ticket.ticket_no_qrcode',
      EMPTY_QRCODE: 'ticket.ticket_no_qrcode',
      MULTIPLE_QRCODES: 'ticket.ticket_multiple_qrcodes',
      INVALID_QRCODE: 'ticket.ticket_empty_qrcode',
    }
    return map[reason] ?? 'ticket.max_attempts_error'
  }

  /**
   * Chama o serviço externo de leitura de QR Code e normaliza erros.
   */
  private async readQRCode(fileName: string) {
    const result = await this.ticketReadService.readQRCode(fileName)

    if (!result || result.erro) {
      return {
        error: 'ERROR_QR_CODE_READER',
        details: result?.message ?? 'Erro desconhecido na API externa',
      }
    }

    return result
  }
}
