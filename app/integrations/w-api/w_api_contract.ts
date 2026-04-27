// ─── Tipos compartilhados ─────────────────────────────────────────────────────

export interface WApiResponse {
  error: boolean
  message?: string
}

export interface WApiMessageResponse extends WApiResponse {
  instanceId?: string
  messageId?: string
  insertedId?: string
}

// ─── Instance ─────────────────────────────────────────────────────────────────

export interface WApiDeviceInfo {
  connectedPhone: string
  lid: string
  name: string
  platform: string
  profilePictureUrl: string
  status: string
  isBusiness: boolean
}

// ─── Message ──────────────────────────────────────────────────────────────────

export interface WApiSendTextPayload {
  phone: string
  message: string
  messageId?: string // Para responder uma mensagem
  delayMessage?: number // Delay em segundos. Padrão: 1~3s
}

export interface WApiSendReactionPayload {
  phone: string
  reaction: string // Emoji da reação
  messageId: string
  delayMessage?: number
}

export interface WApiSendMediaPayload {
  phone: string
  url: string // URL pública da mídia
  caption?: string
  messageId?: string
  delayMessage?: number
}

export interface WApiSendAudioPayload {
  phone: string
  url: string // URL pública do áudio
  delayMessage?: number
}

export interface WApiSendLocationPayload {
  phone: string
  lat: number
  lon: number
  address?: string
  delayMessage?: number
}

export interface WApiSendContactPayload {
  phone: string
  contactPhone: string
  delayMessage?: number
}

export interface WApiSendButtonsPayload {
  phone: string
  title: string
  message: string
  footer?: string
  buttons: Array<{ id: string; text: string }>
  delayMessage?: number
}

export interface WApiListSection {
  title: string
  rows: Array<{ title: string; description?: string; rowId: string }>
}

export interface WApiSendListPayload {
  phone: string
  title: string
  description: string
  buttonText: string
  footerText?: string
  sections: WApiListSection[]
  delayMessage?: number
}

export interface WApiEditMessagePayload {
  phone: string
  text: string
  messageId: string
}

export interface WApiReadMessagePayload {
  phone: string
  messageId?: string
}

export interface WApiDeleteMessageParams {
  phone: string
  messageId: string
}

// ---- Download Media ------
export interface WApiDownloadMediaPayload {
  mediaKey: string
  directPath: string
  type: 'image' | 'document' | 'audio' | 'video' | string
  mimetype: string
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface WApiContact {
  id: string
  name: string
  pushName: string
  profilePictureUrl?: string
  isMyContact: boolean
  isBusiness: boolean
}

export interface WApiContactsResponse extends WApiResponse {
  data: WApiContact[]
}

// ─── Group ────────────────────────────────────────────────────────────────────

export interface WApiGroup {
  id: string
  name: string
  description?: string
  isAdmin: boolean
  participants: Array<{ id: string; isAdmin: boolean }>
}

export interface WApiGroupsResponse extends WApiResponse {
  data: WApiGroup[]
}

export interface WApiCreateGroupPayload {
  name: string
  phones: string[]
}

export interface WApiCreateGroupResponse extends WApiResponse {
  groupId: string
}

export interface WApiGroupParticipantsPayload {
  groupId: string
  phones: string[]
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface WApiChat {
  id: string
  name: string
  lastMessage?: string
  timestamp?: number
  unreadCount?: number
  isGroup: boolean
}

export interface WApiChatsResponse extends WApiResponse {
  data: WApiChat[]
}

// ─── Webhook ──────────────────────────────────────────────────────────────────

export interface WApiWebhookPayload {
  value: string // URL HTTPS do endpoint que receberá os eventos
}

export interface WApiWebhookEvent {
  event:
    | 'webhookReceived'
    | 'webhookSent'
    | 'webhookError'
    | 'webhookDelivery'
    | 'webhookRead'
    | 'webhookDisconnected'
    | 'webhookConnected'
    | 'webhookQrCode'
    | 'webhookChatPresence'
  instanceId: string
  connectedPhone: string
  isGroup: boolean
  messageId: string
  fromMe: boolean
  chat: {
    id: string
    profilePicture?: string
  }
  sender: {
    id: string
    profilePicture?: string
    pushName: string
    verifiedBizName?: string
  }
  moment: number
  msgContent: Record<string, unknown>
}

// ─── Integrator ───────────────────────────────────────────────────────────────

export interface WApiCreateInstanceResponse extends WApiResponse {
  instanceId: string
  token: string
}

export interface WApiInstanceInfo {
  instanceId: string
  token: string
  created: number
  expires: number
  paymentStatus: string
  isTrial: boolean
  instanceName: string
  connected: boolean
  connectedPhone: string
}

export interface WApiListInstancesResponse extends WApiResponse {
  data: WApiInstanceInfo[]
  total: number
  totalPage: number
  pageSize: number
  page: number
}

// ─── Contract ─────────────────────────────────────────────────────────────────

/**
 * WApiContract
 *
 * Interface pública que todos os seus services devem depender.
 * Nunca importe a classe concreta WApi nos modules — importe este contrato.
 *
 * A instância concreta é criada e exportada em start/app.ts.
 */
export interface WApiContract {
  // ── Instance ──────────────────────────────────────────────────────────────
  /** Obtém dados e informações do dispositivo vinculado à instância */
  getDevice(): Promise<WApiDeviceInfo>
  /** Atualiza o nome exibido no perfil do WhatsApp */
  updateProfileName(name: string): Promise<WApiResponse>
  /** Atualiza a foto de perfil do WhatsApp via URL pública */
  updateProfilePicture(url: string): Promise<WApiResponse>
  /** Atualiza a descrição/status do perfil */
  updateProfileDescription(description: string): Promise<WApiResponse>
  /** Configura rejeição automática de ligações recebidas */
  setRejectCalls(reject: boolean): Promise<WApiResponse>
  /** Configura leitura automática de mensagens */
  setAutoReadMessages(autoRead: boolean): Promise<WApiResponse>

  // ── Message ───────────────────────────────────────────────────────────────
  /** Envia mensagem de texto simples ou formatada */
  sendText(payload: WApiSendTextPayload): Promise<WApiMessageResponse>
  /** Envia reação emoji a uma mensagem */
  sendReaction(payload: WApiSendReactionPayload): Promise<WApiMessageResponse>
  /** Remove reação de uma mensagem */
  removeReaction(phone: string, messageId: string): Promise<WApiMessageResponse>
  /** Envia imagem via URL pública */
  sendImage(payload: WApiSendMediaPayload): Promise<WApiMessageResponse>
  /** Envia vídeo via URL pública */
  sendVideo(payload: WApiSendMediaPayload): Promise<WApiMessageResponse>
  /** Envia documento/arquivo via URL pública */
  sendDocument(payload: WApiSendMediaPayload): Promise<WApiMessageResponse>
  /** Envia áudio via URL pública */
  sendAudio(payload: WApiSendAudioPayload): Promise<WApiMessageResponse>
  /** Envia localização geográfica */
  sendLocation(payload: WApiSendLocationPayload): Promise<WApiMessageResponse>
  /** Envia contato */
  sendContact(payload: WApiSendContactPayload): Promise<WApiMessageResponse>
  /** Envia mensagem com botões */
  sendButtons(payload: WApiSendButtonsPayload): Promise<WApiMessageResponse>
  /** Envia lista de opções interativa */
  sendList(payload: WApiSendListPayload): Promise<WApiMessageResponse>
  /** Edita o texto de uma mensagem enviada */
  editMessage(payload: WApiEditMessagePayload): Promise<WApiMessageResponse>
  /** Marca mensagem(ns) como lida(s) */
  readMessage(payload: WApiReadMessagePayload): Promise<WApiResponse>
  /** Deleta uma mensagem do chat */
  deleteMessage(params: WApiDeleteMessageParams): Promise<WApiResponse>

  /** Baixa o arquivo binário de uma mídia recebida */
  downloadMedia(payload: WApiDownloadMediaPayload): Promise<Buffer>

  // ── Contact ───────────────────────────────────────────────────────────────
  /** Lista todos os contatos da instância */
  getContacts(): Promise<WApiContactsResponse>
  /** Verifica se um número possui WhatsApp */
  checkNumber(phone: string): Promise<WApiResponse>

  // ── Group ─────────────────────────────────────────────────────────────────
  /** Lista todos os grupos da instância */
  getGroups(): Promise<WApiGroupsResponse>
  /** Cria um novo grupo */
  createGroup(payload: WApiCreateGroupPayload): Promise<WApiCreateGroupResponse>
  /** Adiciona participantes ao grupo */
  addParticipants(payload: WApiGroupParticipantsPayload): Promise<WApiResponse>
  /** Remove participantes do grupo */
  removeParticipants(payload: WApiGroupParticipantsPayload): Promise<WApiResponse>
  /** Promove participantes a administradores */
  addAdmins(payload: WApiGroupParticipantsPayload): Promise<WApiResponse>
  /** Remove administradores do grupo */
  removeAdmins(payload: WApiGroupParticipantsPayload): Promise<WApiResponse>

  // ── Chat ──────────────────────────────────────────────────────────────────
  /** Lista todos os chats da instância */
  getChats(): Promise<WApiChatsResponse>

  // ── Webhook ───────────────────────────────────────────────────────────────
  /** Configura webhook para mensagens recebidas */
  setWebhookReceived(payload: WApiWebhookPayload): Promise<WApiResponse>
  /** Configura webhook para mensagens enviadas */
  setWebhookSent(payload: WApiWebhookPayload): Promise<WApiResponse>
  /** Configura webhook para erros */
  setWebhookError(payload: WApiWebhookPayload): Promise<WApiResponse>
  /** Configura webhook para confirmações de entrega */
  setWebhookDelivery(payload: WApiWebhookPayload): Promise<WApiResponse>
  /** Configura webhook para confirmações de leitura */
  setWebhookRead(payload: WApiWebhookPayload): Promise<WApiResponse>
  /** Configura webhook para eventos de conexão/desconexão */
  setWebhookConnectionStatus(payload: WApiWebhookPayload): Promise<WApiResponse>
  /** Configura webhook para QR Code */
  setWebhookQrCode(payload: WApiWebhookPayload): Promise<WApiResponse>
  /** Configura webhook para status de presença do chat */
  setWebhookChatPresence(payload: WApiWebhookPayload): Promise<WApiResponse>

  // ── Integrator (requer integrationToken) ──────────────────────────────────
  /** Cria uma nova instância (requer integrationToken) */
  createInstance(name: string): Promise<WApiCreateInstanceResponse>
  /** Lista todas as instâncias da conta (requer integrationToken) */
  listInstances(page?: number, pageSize?: number): Promise<WApiListInstancesResponse>
  /** Deleta uma instância da conta (requer integrationToken) */
  deleteInstance(instanceId: string): Promise<WApiResponse>
}
