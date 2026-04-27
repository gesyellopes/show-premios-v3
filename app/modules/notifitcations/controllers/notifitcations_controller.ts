import type { HttpContext } from '@adonisjs/core/http'
import NotifitcationService from '../services/notifitcation_service.js'

export default class NotifitcationsController {
  async index({ response }: HttpContext) {
    const service = new NotifitcationService()

    return response.ok({
      data: await service.list(),
    })
  }

  async show({ params, response }: HttpContext) {
    const service = new NotifitcationService()

    return response.ok({
      data: await service.find(params.id),
    })
  }

  async store({ request, response }: HttpContext) {
    const service = new NotifitcationService()
    const payload = request.all()

    return response.created({
      data: await service.create(payload),
    })
  }

  async update({ params, request, response }: HttpContext) {
    const service = new NotifitcationService()
    const payload = request.all()

    return response.ok({
      data: await service.update(params.id, payload),
    })
  }

  async destroy({ params, response }: HttpContext) {
    const service = new NotifitcationService()

    await service.delete(params.id)

    return response.ok({
      success: true,
    })
  }
}
