import Event from '../models/event.js'
import type { EventDto } from '../dtos/event_dto.js'

export default class EventService {
  async list() {
    const events = await Event.all()
    return events.map(event => this.toDto(event))
  }

  async find(id: number | string) {
    const event = await Event.find(id)
    if (!event) {
      throw new Error(`Event with id ${id} not found`)
    }
    return this.toDto(event)
  }

  async create(payload: { name: string; draw: number; prefix: string }) {
    const event = await Event.create({
      name: payload.name,
      draw: payload.draw,
      prefix: payload.prefix,
    })
    return this.toDto(event)
  }

  async update(id: number | string, payload: Partial<{ name: string; draw: number; prefix: string }>) {
    const event = await Event.find(id)
    if (!event) {
      throw new Error(`Event with id ${id} not found`)
    }

    if (payload.name !== undefined) event.name = payload.name
    if (payload.draw !== undefined) event.draw = payload.draw
    if (payload.prefix !== undefined) event.prefix = payload.prefix

    await event.save()
    return this.toDto(event)
  }

  async delete(id: number | string) {
    const event = await Event.find(id)
    if (!event) {
      throw new Error(`Event with id ${id} not found`)
    }

    await event.delete()
    return {
      id,
      deleted: true,
    }
  }

  private toDto(event: Event): EventDto {
    return {
      id: event.id,
      name: event.name,
      draw: event.draw,
      prefix: event.prefix,
      createdAt: event.createdAt.toISO(),
      updatedAt: event.updatedAt.toISO(),
    }
  }
}
