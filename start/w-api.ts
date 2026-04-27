// Exemplo em: start/wapi.ts ou services/wapi_service.ts
import env from '#start/env' // ou onde você guarda suas envs
import { WApi } from '#integrations/w-api/w_api.ts'

export const wapi = new WApi({
  token: env.get('WAPI_TOKEN'),
  instanceId: env.get('WAPI_INSTANCE_ID'),
  // baseUrl: 'opcional'
})
