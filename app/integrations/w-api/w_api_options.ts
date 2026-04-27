/**
 * WApiOptions
 *
 * Configurações passadas ao construtor da WApi.
 * Nunca hardcode credenciais — leia sempre de variáveis de ambiente.
 *
 * Exemplo:
 *   new WApi({
 *     token: env.get('WAPI_TOKEN'),
 *     instanceId: env.get('WAPI_INSTANCE_ID'),
 *   })
 *
 * Para uso como Integrador (gerenciar múltiplas instâncias):
 *   new WApi({
 *     integrationToken: env.get('WAPI_INTEGRATION_TOKEN'),
 *   })
 */
export interface WApiOptions {
  /**
   * Token de autenticação Bearer da instância.
   * Obrigatório para todas as operações de instância, mensagens, grupos e contatos.
   */
  token?: string

  /**
   * ID da instância WhatsApp conectada.
   * Enviado como query param ?instanceId= em todos os endpoints.
   */
  instanceId?: string

  /**
   * Token de integrador — usado exclusivamente para criar e gerenciar
   * múltiplas instâncias via endpoints /v1/integrator/*.
   */
  integrationToken?: string

  /**
   * URL base da API. Padrão: https://api.w-api.app
   */
  baseUrl?: string

  /**
   * Timeout das requisições em milissegundos. Padrão: 15000 (15s)
   */
  timeout?: number
}
