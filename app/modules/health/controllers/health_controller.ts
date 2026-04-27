import type { HttpContext } from '@adonisjs/core/http'
import HealthService from '../services/health_service.js'

export default class HealthController {
  
  //Retorna se a aplicação está funcionando
  async live({response}:HttpContext){
    return response.ok({
      status: 'ok',
      service: 'wob-core',
      uptime_seconds: process.uptime(),
      timestamp: new Date().toISOString(),
    })
  }

  //Retorna o status de apps, dbs
  async ready({ response }: HttpContext) {
    const healthService = new HealthService()
    const result = await healthService.readiness()

    if (result.status === 'not_ready') {
      return response.status(503).send(result)
    }

    return response.ok(result)
  }

  
}
