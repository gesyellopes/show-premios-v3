import type { ApplicationService } from '@adonisjs/core/types'

export default class HealthProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    //
  }

  async boot() {
    //
  }

  async start() {
    //
  }

  async ready() {
    //
  }

  async shutdown() {
    //
  }
}
