import type Agent from '../models/agent.js'

export class AgentDto {
  id: number
  uuid: string
  eventId: number
  name: string
  userId: number
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

  constructor(agent: Agent) {
    this.id = agent.id
    this.uuid = agent.uuid
    this.eventId = agent.eventId
    this.name = agent.name
    this.userId = agent.userId
    this.createdAt = agent.createdAt.toISO()!
    this.updatedAt = agent.updatedAt?.toISO()!
  }
}
