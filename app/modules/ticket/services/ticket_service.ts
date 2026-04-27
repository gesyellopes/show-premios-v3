// app/services/webhook_service.ts
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

@inject()
export default class TicketService {
  async list() {
    return []
  }

  async find(id: number | string) {
    return {
      id,
    }
  }

  async create(payload: Record<string, unknown>) {
    return {
      ...payload,
    }
  }

  async update(id: number | string, payload: Record<string, unknown>) {
    return {
      id,
      ...payload,
    }
  }

  async delete(id: number | string) {
    return {
      id,
      deleted: true,
    }
  }

  /**
   * Cria tickets em lote para um evento específico.
   * @param data Objeto contendo eventId, prefix, volume e status opcional
   */
  async bulkCreate(data: { eventId: number; prefix: string; volume: number; status?: string }) {
    const status = data.status || 'WAITING_SALE'
    // toSQL({ includeOffset: false }) gera o formato 'YYYY-MM-DD HH:MM:SS'
    const now = DateTime.now().toSQL({ includeOffset: false })
    const ticketsToCreate = []

    for (let i = 1; i <= data.volume; i++) {
      const paddedNumber = i.toString().padStart(6, '0')
      ticketsToCreate.push({
        created_at: now, // Nome da coluna no banco
        event_id: Number(data.eventId), // Garantir que é número
        status: status,
        ticket_number: `${data.prefix}${paddedNumber}`,
        updated_at: now, // Nome da coluna no banco
        uuid: randomUUID(), // UUID gerado manualmente pois Query Builder pula hooks
      })
    }

    // Para grandes volumes (ex: 5000+), inserimos em blocos (chunks) dentro de uma transação.
    // Isso evita erros de "Packet too large" ou excesso de placeholders.
    const trx = await db.transaction()

    try {
      const chunkSize = 1000 // Inserir de 1000 em 1000 é um equilíbrio seguro
      for (let i = 0; i < ticketsToCreate.length; i += chunkSize) {
        const chunk = ticketsToCreate.slice(i, i + chunkSize)
        await db.table('tickets').useTransaction(trx).multiInsert(chunk)
      }

      await trx.commit()
    } catch (error: any) {
      await trx.rollback()

      // Log limpo para você ver o erro real no console do VS Code / Terminal
      // console.error('-----------------------------------------')
      // console.error('ERRO NO SQL:', error.message)
      // console.error('CÓDIGO DO ERRO:', error.code)
      // console.error('-----------------------------------------')

      throw new Error(`Falha na criação em lote: ${error.message}`)
    }

    return { count: data.volume }
  }
}
