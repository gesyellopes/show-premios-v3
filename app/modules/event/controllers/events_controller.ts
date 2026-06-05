import type { HttpContext } from '@adonisjs/core/http'
import EventService from '../services/event_service.js'
import { createEventValidator } from '../validators/create_event_validator.js'
import { updateEventValidator } from '../validators/update_event_validator.js'

export default class EventsController {
  private eventService = new EventService()

  async index({ response }: HttpContext) {
    try {
      const events = await this.eventService.list()
      return response.ok(events)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to list events' })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const event = await this.eventService.find(params.id)
      return response.ok(event)
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return response.notFound({ message: `Event with id ${params.id} not found` })
      }
      return response.internalServerError({ message: 'Failed to fetch event' })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createEventValidator)

      const event = await this.eventService.create(payload)
      return response.created(event)
    } catch (error) {
      return response.badRequest({ message: 'Validation failed' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateEventValidator)

      const event = await this.eventService.update(params.id, payload)
      return response.ok(event)
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return response.notFound({ message: `Event with id ${params.id} not found` })
      }
      return response.badRequest({ message: 'Validation failed' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.eventService.delete(params.id)
      return response.ok(result)
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return response.notFound({ message: `Event with id ${params.id} not found` })
      }
      return response.internalServerError({ message: 'Failed to delete event' })
    }
  }
}
