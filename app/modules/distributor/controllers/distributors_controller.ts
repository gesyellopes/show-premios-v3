import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import DistributorService from '../services/distributor_service.js'
import { createDistributorValidator } from '../validators/create_distributor_validator.js'

@inject()
export default class DistributorsController {
  constructor(protected distributorService: DistributorService) {}

  async index({ response, params }: HttpContext) {
    const eventId = Number(params.eventId)
    const distributors = await this.distributorService.list(eventId)
    return response.ok(distributors)
  }

  async store({ request, response, params }: HttpContext) {
    const eventId = Number(params.eventId)
    const payload = await request.validateUsing(createDistributorValidator)
    const distributor = await this.distributorService.create(eventId, payload)
    return response.created(distributor)
  }
}
