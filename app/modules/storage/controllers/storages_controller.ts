import type { HttpContext } from '@adonisjs/core/http'

export default class StoragesController {
  async index({ response }: HttpContext) {
    return response.ok({
      module: 'storage',
      action: 'index',
    })
  }
}
