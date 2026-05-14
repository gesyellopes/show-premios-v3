import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import VendorService from '../services/vendor_service.js'
import { createVendorValidator } from '../validators/create_vendor_validator.js'

@inject()
export default class VendorsController {
  constructor(protected vendorService: VendorService) {}

  async index({ response, params }: HttpContext) {
    const eventId = Number(params.eventId)
    const vendors = await this.vendorService.list(eventId)
    return response.ok(vendors)
  }

  async store({ request, response, params }: HttpContext) {
    const eventId = Number(params.eventId)
    const payload = await request.validateUsing(createVendorValidator)
    const vendor = await this.vendorService.create(eventId, payload)
    return response.created(vendor)
  }
}
