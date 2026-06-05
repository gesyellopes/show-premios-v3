import type { HttpContext } from '@adonisjs/core/http'
import DealerService from '../services/dealer_service.js'
import { createDealerValidator } from '../validators/create_dealer_validator.js'
import { updateDealerValidator } from '../validators/update_dealer_validator.js'

export default class DealersController {
  private dealerService = new DealerService()

  async index({ response }: HttpContext) {
    const dealers = await this.dealerService.list()
    return response.ok(dealers)
  }

  async show({ params, response }: HttpContext) {
    try {
      const dealer = await this.dealerService.find(params.id)
      return response.ok(dealer)
    } catch (error) {
      return response.notFound({ message: 'Dealer not found' })
    }
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createDealerValidator)
    const dealer = await this.dealerService.create(payload)

    return response.created(dealer)
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateDealerValidator)
      const dealer = await this.dealerService.update(params.id, payload)

      return response.ok(dealer)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (errorMessage.includes('not found')) {
        return response.notFound({ message: 'Dealer not found' })
      }
      return response.badRequest({ message: errorMessage })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      await this.dealerService.delete(params.id)
      return response.ok({ message: 'Dealer deleted successfully' })
    } catch (error) {
      return response.notFound({ message: 'Dealer not found' })
    }
  }
}
