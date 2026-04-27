export type HealthStatus = 'healthy' | 'unhealthy'

export interface HealthCheckResult {
  key: string
  status: HealthStatus
  message: string
  duration_ms: number
  meta?: Record<string, unknown>
}