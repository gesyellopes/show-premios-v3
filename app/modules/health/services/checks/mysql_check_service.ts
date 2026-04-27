import db from '@adonisjs/lucid/services/db'
import type { HealthCheckResult } from '../../types/health_check_result.js'

export default class MysqlCheckService {
  public async run(): Promise<HealthCheckResult> {
    const startedAt = performance.now()

    try {
      await db.rawQuery('SELECT 1')

      const duration = Number((performance.now() - startedAt).toFixed(2))

      return {
        key: 'mysql',
        status: 'healthy',
        message: 'MySQL connection established successfully',
        duration_ms: duration,
      }
    } catch (error) {
      const duration = Number((performance.now() - startedAt).toFixed(2))

      return {
        key: 'mysql',
        status: 'unhealthy',
        message: 'Failed to connect to MySQL',
        duration_ms: duration,
        meta: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      }
    }
  }
}