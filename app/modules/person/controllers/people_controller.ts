import type { HttpContext } from '@adonisjs/core/http'

export default class PeopleController {
  async index({ response }: HttpContext) {
    return response.ok({
      module: 'person',
      action: 'index',
    })
  }
}
