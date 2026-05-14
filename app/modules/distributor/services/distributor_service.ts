import Distributor from '../models/distributor.js'

export default class DistributorService {
  async list(eventId: number) {
    return Distributor.query().where('event_id', eventId)
  }

  async find(id: number | string) {
    return Distributor.findOrFail(id)
  }

  async create(eventId: number, payload: { name: string }) {
    return Distributor.create({
      eventId,
      name: payload.name,
    })
  }

  async update(id: number | string, payload: Record<string, unknown>) {
    const distributor = await Distributor.findOrFail(id)
    return distributor.merge(payload).save()
  }

  async delete(id: number | string) {
    const distributor = await Distributor.findOrFail(id)
    return distributor.delete()
  }
}
