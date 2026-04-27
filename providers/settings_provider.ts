// providers/settings_provider.ts
import { ApplicationService } from '@adonisjs/core/types'
import SettingsService from '#services/settings_service'

export default class SettingsProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(SettingsService, async () => {
      return new SettingsService()
    })
  }

  async boot() {

    
    const settings = await this.app.container.make(SettingsService)
    await settings.load()
    
  }
}