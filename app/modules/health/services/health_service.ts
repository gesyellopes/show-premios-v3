import MysqlCheckService from './checks/mysql_check_service.js'
import RedisCheckService from './checks/redis_check_service.js'
import type { HealthCheckResult } from '../types/health_check_result.js'

export default class HealthService {
  public async readiness() {
    const checks: HealthCheckResult[] = []

    checks.push(await new MysqlCheckService().run())
    checks.push(await new RedisCheckService().run())

    const hasUnhealthy = checks.some((check) => check.status === 'unhealthy')

    return {
      status: hasUnhealthy ? 'not_ready' : 'ready',
      checks,
      timestamp: new Date().toISOString(),
    }
  }
}