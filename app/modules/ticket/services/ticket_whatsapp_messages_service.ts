// app/services/ticket_whatsapp_service.ts
import TicketWhatsappMessage from '#modules/ticket/models/ticket_whatsapp_messages.js'
import Ticket from '#modules/ticket/models/ticket.js'
import { DateTime } from 'luxon'

export default class TicketWhatsappService {
  /**
   * Registra a mensagem recebida e tenta processar o ticket vinculado
   */
  async processIncomingMessage(data: {
    messageId: string
    senderNumber: string
    whatsappMessageId: string
    senderName?: string
    filename?: string
    attempts: number
    sentAt?: string | number
  }) {
    let finalSentAt: any = data.sentAt || DateTime.now()

    // Se o sentAt vier como timestamp numérico (segundos ou milissegundos),
    // convertemos para Luxon DateTime para que o Lucid trate a persistência.
    if (
      typeof finalSentAt === 'number' ||
      (typeof finalSentAt === 'string' && !Number.isNaN(Number(finalSentAt)))
    ) {
      const ts = Number(finalSentAt)
      // WhatsApp metadata costuma enviar em segundos (10 dígitos).
      // Checamos a grandeza para decidir entre fromSeconds ou fromMillis.
      finalSentAt = ts > 10000000000 ? DateTime.fromMillis(ts) : DateTime.fromSeconds(ts)
    }

    return await TicketWhatsappMessage.create({
      ...data,
      sentAt: finalSentAt,
      status: 'RECEIVED',
    })
  }

  /**
   * Incrementa o contador de tentativas da mensagem vinculado ao messageId
   */
  async incrementAttempts(messageId: string) {
    const message = await TicketWhatsappMessage.findByOrFail('messageId', messageId)
    message.attempts = (Number(message.attempts) || 0) + 1
    await message.save()
    return message.attempts
  }

  /**
   * Aprovação manual/automática da imagem enviada
   */
  async approveValidation(data: { messageId: string; ticketNumber: string }) {
    const message = await TicketWhatsappMessage.findByOrFail('messageId', data.messageId)

    //message.attempts = (Number(message.attempts) || 0) + 1
    message.ticketNumber = data.ticketNumber
    message.status = 'VALIDATED' // Atualiza o status da mensagem
    await message.save()

    // Atualiza o ticket correspondente
    const ticket = await Ticket.query().where('ticket_number', message.ticketNumber).first()

    if (ticket) {
      ticket.messageId = message.messageId
      ticket.status = 'VALIDATED'
      ticket.validatedAt = DateTime.now()
      await ticket.save()
    }

    return { message, ticket }
  }

  /**
   * Rejeita uma validação (ex: foto borrada ou fraude)
   */
  async rejectValidation(messageId: string) {
    const message = await TicketWhatsappMessage.findOrFail(messageId)

    message.status = 'REJECTED'
    message.attempts = (Number(message.attempts) || 0) + 1
    await message.save()

    return message
  }

  /**
   * Busca uma mensagem pelo código
   */
  async findByCode(messageId: string) {
    return await TicketWhatsappMessage.findBy('messageId', messageId)
  }

  /**
   * Busco um ticket pelo código
   */
  /**
   * Busca uma mensagem pelo código
   */
  async findTicket(ticketNumber: string) {
    return await Ticket.query().where('ticket_number', ticketNumber).first()
  }

  //Preciso de um método verifique se o ticket já foi validado (ou seja o status dele é VALIDATED) através do ticketNumber e retorne apenas false or true
  async isTicketValidated(ticketNumber: string) {
    const ticket = await Ticket.query().where('ticket_number', ticketNumber).first()

    if (ticket?.status === 'VALIDATED') {
      return true
    } else {
      return false
    }
  }

  /**
   * Monta o payload de processamento a partir de um registro do banco de dados.
   * Útil para retomar o processamento de mensagens que já foram persistidas.
   */
  preparePayload(message: TicketWhatsappMessage) {
    return {
      whatsappMessageId: message.whatsappMessageId,
      senderNumber: message.senderNumber,
      senderName: message.senderName,
      sentAt: message.sentAt?.toUnixInteger(),
      fileName: message.filename, // Mapeia a coluna 'filename' do banco para 'fileName' da interface
      messageId: message.messageId,
    }
  }

  /**
   * Atualiza o status de uma mensagem de WhatsApp pelo messageId
   */
  async updateStatus(messageId: string, status: string, ticketNumber?: string) {
    const message = await TicketWhatsappMessage.findByOrFail('messageId', messageId)
    message.status = status
    if (ticketNumber) message.ticketNumber = ticketNumber
    await message.save()
    return message
  }
}
