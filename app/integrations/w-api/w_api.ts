import type {
  WApiContract,
  WApiResponse,
  WApiMessageResponse,
  WApiDeviceInfo,
  WApiSendTextPayload,
  WApiSendReactionPayload,
  WApiSendMediaPayload,
  WApiSendAudioPayload,
  WApiSendLocationPayload,
  WApiSendContactPayload,
  WApiSendButtonsPayload,
  WApiSendListPayload,
  WApiEditMessagePayload,
  WApiReadMessagePayload,
  WApiDeleteMessageParams,
  WApiContactsResponse,
  WApiGroupsResponse,
  WApiCreateGroupPayload,
  WApiCreateGroupResponse,
  WApiGroupParticipantsPayload,
  WApiChatsResponse,
  WApiWebhookPayload,
  WApiCreateInstanceResponse,
  WApiListInstancesResponse,
  WApiDownloadMediaPayload,
} from './w_api_contract.js'
import type { WApiOptions } from './w_api_options.js'

/**
 * WApi
 *
 * Implementação concreta do WApiContract.
 * Instancie apenas no start/app.ts — nunca dentro de modules.
 *
 * Exemplo:
 *   export const wapi = new WApi({
 *     token: env.get('WAPI_TOKEN'),
 *     instanceId: env.get('WAPI_INSTANCE_ID'),
 *   })
 */
export class WApi implements WApiContract {
  private readonly baseUrl: string
  private readonly timeout: number

  constructor(private readonly options: WApiOptions) {
    this.baseUrl = options.baseUrl ?? 'https://api.w-api.app'
    this.timeout = options.timeout ?? 15_000
  }

  // ─── HTTP helpers ──────────────────────────────────────────────────────────

  private get instanceHeaders(): Record<string, string> {
    if (!this.options.token) {
      throw new Error('[WApi] "token" is required for instance operations')
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.options.token}`,
    }
  }

  private get integratorHeaders(): Record<string, string> {
    if (!this.options.integrationToken) {
      throw new Error('[WApi] "integrationToken" is required for integrator operations')
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.options.integrationToken}`,
    }
  }

  private instanceId(): string {
    if (!this.options.instanceId) {
      throw new Error('[WApi] "instanceId" is required')
    }
    return this.options.instanceId
  }

  private url(path: string, extraParams?: Record<string, string>): string {
    const params = new URLSearchParams({
      instanceId: this.instanceId(),
      ...extraParams,
    })
    return `${this.baseUrl}${path}?${params.toString()}`
  }

  private integratorUrl(path: string, extraParams?: Record<string, string>): string {
    const params = new URLSearchParams(extraParams)
    const query = params.toString()
    return `${this.baseUrl}${path}${query ? `?${query}` : ''}`
  }

  private async request<T = WApiResponse>(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: unknown
  ): Promise<T> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeout)

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`[WApi] HTTP ${res.status} on ${method} ${url}: ${text}`)
      }

      return res.json() as Promise<T>
    } finally {
      clearTimeout(timer)
    }
  }

  private get<T>(url: string, headers: Record<string, string>) {
    return this.request<T>('GET', url, headers)
  }

  private post<T>(url: string, headers: Record<string, string>, body: unknown) {
    return this.request<T>('POST', url, headers, body)
  }

  private put<T>(url: string, headers: Record<string, string>, body: unknown) {
    return this.request<T>('PUT', url, headers, body)
  }

  private delete<T>(url: string, headers: Record<string, string>, body?: unknown) {
    return this.request<T>('DELETE', url, headers, body)
  }

  // ─── Instance ─────────────────────────────────────────────────────────────

  async getDevice(): Promise<WApiDeviceInfo> {
    return this.get(this.url('/v1/instance/device'), this.instanceHeaders)
  }

  async updateProfileName(name: string): Promise<WApiResponse> {
    return this.put(this.url('/v1/instance/profile-name'), this.instanceHeaders, { name })
  }

  async updateProfilePicture(url: string): Promise<WApiResponse> {
    return this.put(this.url('/v1/instance/profile-picture'), this.instanceHeaders, { url })
  }

  async updateProfileDescription(description: string): Promise<WApiResponse> {
    return this.put(this.url('/v1/instance/profile-description'), this.instanceHeaders, {
      description,
    })
  }

  async setRejectCalls(reject: boolean): Promise<WApiResponse> {
    return this.put(this.url('/v1/instance/reject-call'), this.instanceHeaders, { value: reject })
  }

  async setAutoReadMessages(autoRead: boolean): Promise<WApiResponse> {
    return this.put(this.url('/v1/instance/update-auto-read-message'), this.instanceHeaders, {
      value: autoRead,
    })
  }

  // ─── Message ──────────────────────────────────────────────────────────────

  async sendText(payload: WApiSendTextPayload): Promise<WApiMessageResponse> {
    return this.post(this.url('/v1/message/send-text'), this.instanceHeaders, payload)
  }

  async sendReaction(payload: WApiSendReactionPayload): Promise<WApiMessageResponse> {
    return this.post(this.url('/v1/message/send-reaction'), this.instanceHeaders, payload)
  }

  async removeReaction(phone: string, messageId: string): Promise<WApiMessageResponse> {
    return this.post(this.url('/v1/message/send-reaction'), this.instanceHeaders, {
      phone,
      reaction: '',
      messageId,
    })
  }

  async sendImage(payload: WApiSendMediaPayload): Promise<WApiMessageResponse> {
    return this.post(this.url('/v1/message/send-image'), this.instanceHeaders, payload)
  }

  async sendVideo(payload: WApiSendMediaPayload): Promise<WApiMessageResponse> {
    return this.post(this.url('/v1/message/send-video'), this.instanceHeaders, payload)
  }

  async sendDocument(payload: WApiSendMediaPayload): Promise<WApiMessageResponse> {
    return this.post(this.url('/v1/message/send-document'), this.instanceHeaders, payload)
  }

  async sendAudio(payload: WApiSendAudioPayload): Promise<WApiMessageResponse> {
    return this.post(this.url('/v1/message/send-audio'), this.instanceHeaders, payload)
  }

  async sendLocation(payload: WApiSendLocationPayload): Promise<WApiMessageResponse> {
    return this.post(this.url('/v1/message/send-location'), this.instanceHeaders, payload)
  }

  async sendContact(payload: WApiSendContactPayload): Promise<WApiMessageResponse> {
    return this.post(this.url('/v1/message/send-contact'), this.instanceHeaders, payload)
  }

  async sendButtons(payload: WApiSendButtonsPayload): Promise<WApiMessageResponse> {
    return this.post(this.url('/v1/message/send-button-list'), this.instanceHeaders, payload)
  }

  async sendList(payload: WApiSendListPayload): Promise<WApiMessageResponse> {
    return this.post(this.url('/v1/message/send-list'), this.instanceHeaders, payload)
  }

  async editMessage(payload: WApiEditMessagePayload): Promise<WApiMessageResponse> {
    return this.post(this.url('/v1/message/edit-message'), this.instanceHeaders, payload)
  }

  async readMessage(payload: WApiReadMessagePayload): Promise<WApiResponse> {
    return this.post(this.url('/v1/message/read-message'), this.instanceHeaders, payload)
  }

  async deleteMessage(params: WApiDeleteMessageParams): Promise<WApiResponse> {
    return this.delete(
      this.url('/v1/message/delete-message', {
        phone: params.phone,
        messageId: params.messageId,
      }),
      this.instanceHeaders
    )
  }

  // Media
  // Adicione ao w_api.ts

  async downloadMedia(payload: WApiDownloadMediaPayload): Promise<Buffer> {
    // Precisamos de um helper de request que aceite retorno binário,
    // já que o seu helper .request padrão faz .json()

    const url = this.url('/v1/message/download-media')
    const headers = this.instanceHeaders

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`[WApi] HTTP ${res.status} ao baixar mídia: ${text}`)
    }

    // Retorna os dados como Buffer
    const arrayBuffer = await res.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  // ─── Contact ──────────────────────────────────────────────────────────────

  async getContacts(): Promise<WApiContactsResponse> {
    return this.get(this.url('/v1/contact/get-contacts'), this.instanceHeaders)
  }

  async checkNumber(phone: string): Promise<WApiResponse> {
    return this.get(this.url('/v1/contact/check-number', { phone }), this.instanceHeaders)
  }

  // ─── Group ────────────────────────────────────────────────────────────────

  async getGroups(): Promise<WApiGroupsResponse> {
    return this.get(this.url('/v1/group/get-groups'), this.instanceHeaders)
  }

  async createGroup(payload: WApiCreateGroupPayload): Promise<WApiCreateGroupResponse> {
    return this.post(this.url('/v1/group/create-group'), this.instanceHeaders, payload)
  }

  async addParticipants(payload: WApiGroupParticipantsPayload): Promise<WApiResponse> {
    return this.post(this.url('/v1/group/add-participant'), this.instanceHeaders, payload)
  }

  async removeParticipants(payload: WApiGroupParticipantsPayload): Promise<WApiResponse> {
    return this.delete(this.url('/v1/group/remove-participant'), this.instanceHeaders, payload)
  }

  async addAdmins(payload: WApiGroupParticipantsPayload): Promise<WApiResponse> {
    return this.post(this.url('/v1/group/add-admin'), this.instanceHeaders, payload)
  }

  async removeAdmins(payload: WApiGroupParticipantsPayload): Promise<WApiResponse> {
    return this.post(this.url('/v1/group/remove-admin'), this.instanceHeaders, payload)
  }

  // ─── Chat ─────────────────────────────────────────────────────────────────

  async getChats(): Promise<WApiChatsResponse> {
    return this.get(this.url('/v1/chat/get-chats'), this.instanceHeaders)
  }

  // ─── Webhook ──────────────────────────────────────────────────────────────

  async setWebhookReceived(payload: WApiWebhookPayload): Promise<WApiResponse> {
    return this.put(this.url('/v1/webhook/update-webhook-received'), this.instanceHeaders, payload)
  }

  async setWebhookSent(payload: WApiWebhookPayload): Promise<WApiResponse> {
    return this.put(this.url('/v1/webhook/update-webhook-sent'), this.instanceHeaders, payload)
  }

  async setWebhookError(payload: WApiWebhookPayload): Promise<WApiResponse> {
    return this.put(this.url('/v1/webhook/update-webhook-error'), this.instanceHeaders, payload)
  }

  async setWebhookDelivery(payload: WApiWebhookPayload): Promise<WApiResponse> {
    return this.put(this.url('/v1/webhook/update-webhook-delivery'), this.instanceHeaders, payload)
  }

  async setWebhookRead(payload: WApiWebhookPayload): Promise<WApiResponse> {
    return this.put(this.url('/v1/webhook/update-webhook-read'), this.instanceHeaders, payload)
  }

  async setWebhookConnectionStatus(payload: WApiWebhookPayload): Promise<WApiResponse> {
    return this.put(
      this.url('/v1/webhook/update-webhook-connection-status'),
      this.instanceHeaders,
      payload
    )
  }

  async setWebhookQrCode(payload: WApiWebhookPayload): Promise<WApiResponse> {
    return this.put(this.url('/v1/webhook/update-webhook-qrcode'), this.instanceHeaders, payload)
  }

  async setWebhookChatPresence(payload: WApiWebhookPayload): Promise<WApiResponse> {
    return this.put(
      this.url('/v1/webhook/update-webhook-chat-presence'),
      this.instanceHeaders,
      payload
    )
  }

  // ─── Integrator ───────────────────────────────────────────────────────────

  async createInstance(name: string): Promise<WApiCreateInstanceResponse> {
    return this.post(this.integratorUrl('/v1/integrator/create-instance'), this.integratorHeaders, {
      name,
    })
  }

  async listInstances(page = 1, pageSize = 10): Promise<WApiListInstancesResponse> {
    return this.get(
      this.integratorUrl('/v1/integrator/instances', {
        page: String(page),
        pageSize: String(pageSize),
      }),
      this.integratorHeaders
    )
  }

  async deleteInstance(instanceId: string): Promise<WApiResponse> {
    return this.delete(
      this.integratorUrl('/v1/integrator/delete-instance', { instanceId }),
      this.integratorHeaders
    )
  }
}
