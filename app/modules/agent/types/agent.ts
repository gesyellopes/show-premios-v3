export interface AgentPayload {
  id?: number
  uuid?: string
  eventId: number
  name: string
  userId: number
  createdAt?: string
  updatedAt?: string
}

export interface AgentResponse extends AgentPayload {
  id: number
  uuid: string
  eventId: number
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    name: string
    email: string
  }
  event?: {
    id: number
    name: string
  }
}
