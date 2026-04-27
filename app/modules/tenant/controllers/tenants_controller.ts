import type { HttpContext } from '@adonisjs/core/http'
import TenantService from '../services/tenant_service.js'

export default class TenantsController {
  async index({ response }: HttpContext) {
    const service = new TenantService()

    return response.ok({
      data: await service.list(),
    })
  }

  async show({ params, response }: HttpContext) {
    const service = new TenantService()

    return response.ok({
      data: await service.find(params.id),
    })
  }

  async store({ request, response }: HttpContext) {
    const service = new TenantService()
    const payload = request.all()

    return response.created({
      data: await service.create(payload),
    })
  }

  async update({ params, request, response }: HttpContext) {
    const service = new TenantService()
    const payload = request.all()

    return response.ok({
      data: await service.update(params.id, payload),
    })
  }

  async destroy({ params, response }: HttpContext) {
    const service = new TenantService()

    await service.delete(params.id)

    return response.ok({
      success: true,
    })
  }
}
