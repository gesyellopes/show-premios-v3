export interface DealerPayload {
  id?: number
  uuid?: string
  eventId: number
  name: string
  userId: number
}

export interface DealerResponse {
  id: number
  uuid: string
  eventId: number
  name: string
  userId: number
  user: {
    id: number
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string | null
}
