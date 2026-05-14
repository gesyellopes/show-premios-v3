import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import Ticket from '../models/ticket.ts'

@inject()
export default class TicketService {
  async list() {
    return []
  }

  async find(id: number | string) {
    return Ticket.findOrFail(id)
  }

  async create(payload: Record<string, unknown>) {
    return Ticket.create(payload)
  }

  async update(id: number | string, payload: Record<string, unknown>) {
    const ticket = await Ticket.findOrFail(id)
    return ticket.merge(payload).save()
  }

  async delete(id: number | string) {
    const ticket = await Ticket.findOrFail(id)
    return ticket.delete()
  }

  async listByFilters(filters: {
    event_id: number
    distributor_id?: number
    vendor_id?: number
    distributor_category_id?: number
    page?: number
    limit?: number
  }) {
    const page = filters.page || 1
    const limit = filters.limit || 15

    let query = Ticket.query().where('event_id', filters.event_id)

    if (filters.distributor_id) {
      query = query.andWhere('distributor_id', filters.distributor_id)
    }

    if (filters.vendor_id) {
      query = query.andWhere('vendor_id', filters.vendor_id)
    }

    if (filters.distributor_category_id) {
      query = query.andWhere('distributor_category_id', filters.distributor_category_id)
    }

    return query.paginate(page, limit)
  }

  async bulkUpdate(
    eventId: number,
    updates: {
      distributor_id?: number
      vendor_id?: number
      distributor_category_id?: number
    }
  ) {
    const updateData: Record<string, any> = {}

    if (updates.distributor_id !== undefined) {
      updateData.distributor_id = updates.distributor_id
    }

    if (updates.vendor_id !== undefined) {
      updateData.vendor_id = updates.vendor_id
    }

    if (updates.distributor_category_id !== undefined) {
      updateData.distributor_category_id = updates.distributor_category_id
    }

    const result = await db.from('tickets').where('event_id', eventId).update(updateData)

    return {
      updated: result,
      changes: updateData,
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
