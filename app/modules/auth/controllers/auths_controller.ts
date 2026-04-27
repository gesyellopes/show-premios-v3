import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '../services/auth_service.js'

export default class AuthsController {
  async index({ response }: HttpContext) {
    const service = new AuthService()

    return response.ok({
      data: await service.list(),
    })
  }

  async show({ params, response }: HttpContext) {
    const service = new AuthService()

    return response.ok({
      data: await service.find(params.id),
    })
  }

  async store({ request, response }: HttpContext) {
    const service = new AuthService()
    const payload = request.all()

    return response.created({
      data: await service.create(payload),
    })
  }

  async update({ params, request, response }: HttpContext) {
    const service = new AuthService()
    const payload = request.all()

    return response.ok({
      data: await service.update(params.id, payload),
    })
  }

  async destroy({ params, response }: HttpContext) {
    const service = new AuthService()

    await service.delete(params.id)

    return response.ok({
      success: true,
    })
  }
}
