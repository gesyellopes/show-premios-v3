import { v4 as uuidv4 } from 'uuid'
import Agent from '../models/agent.js'
import type { AgentPayload } from '../types/agent.js'
import { AgentDto } from '../dtos/agent_dto.js'

export default class AgentService {
  async list() {
    const agents = await Agent.query()
      .preload('user', (query) => {
        query.select('id', 'name', 'email')
      })
      .preload('event', (query) => {
        query.select('id', 'name')
      })
    return agents.map((agent) => new AgentDto(agent))
  }

  async find(id: number | string) {
    const agent = await Agent.query()
      .where('id', id)
      .orWhere('uuid', id as string)
      .preload('user', (query) => {
        query.select('id', 'name', 'email')
      })
      .preload('event', (query) => {
        query.select('id', 'name')
      })
      .firstOrFail()

    return new AgentDto(agent)
  }

  async create(payload: AgentPayload) {
    const agent = await Agent.create({
      uuid: uuidv4(),
      eventId: payload.eventId,
      name: payload.name,
      userId: payload.userId,
    })

    await agent.load('user', (query) => {
      query.select('id', 'name', 'email')
    })

    await agent.load('event', (query) => {
      query.select('id', 'name')
    })

    return new AgentDto(agent)
  }

  async update(id: number | string, payload: Partial<AgentPayload>) {
    const agent = await Agent.query()
      .where('id', id)
      .orWhere('uuid', id as string)
      .firstOrFail()

    if (payload.eventId) {
      agent.eventId = payload.eventId
    }

    if (payload.name) {
      agent.name = payload.name
    }

    if (payload.userId) {
      agent.userId = payload.userId
    }

    await agent.save()

    await agent.load('user', (query) => {
      query.select('id', 'name', 'email')
    })

    await agent.load('event', (query) => {
      query.select('id', 'name')
    })

    return new AgentDto(agent)
  }

  async delete(id: number | string) {
    const agent = await Agent.query()
      .where('id', id)
      .orWhere('uuid', id as string)
      .firstOrFail()

    await agent.delete()

    return {
      id: agent.id,
      uuid: agent.uuid,
      eventId: agent.eventId,
      deleted: true,
    }
  }
}
