import type { HealthCheckResult } from '../../types/health_check_result.js'
import redis from '@adonisjs/redis/services/main'

export default class RedisCheckService {
  public async run(): Promise<HealthCheckResult> {
    const startedAt = performance.now()

    try {
      const result = await redis.ping()
      const duration = Number((performance.now() - startedAt).toFixed(2))

      return {
        key: 'redis',
        status: result === 'PONG' ? 'healthy' : 'unhealthy',
        message:
          result === 'PONG'
            ? 'Redis connection established successfully'
            : `Unexpected Redis ping response: ${result}`,
        duration_ms: duration,
        meta: {
          response: result,
        },
      }
    } catch (error) {
      const duration = Number((performance.now() - startedAt).toFixed(2))

      return {
        key: 'redis',
        status: 'unhealthy',
        message: 'Failed to connect to Redis',
        duration_ms: duration,
        meta: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      }
    }
  }
}