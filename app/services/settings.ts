import app from '@adonisjs/core/services/app'
import SettingsService from '#services/settings_service'

let settings: SettingsService

await app.booted(async () => {
  settings = await app.container.make(SettingsService)
})

export { settings as default }