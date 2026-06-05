import { v4 as uuid } from 'uuid'
import Dealer from '../models/dealer.js'
import User from '#modules/user/models/user.js'
import type { DealerPayload } from '../types/dealer.js'

export default class DealerService {
  private async getUserData(userId: number) {
    return await User.query().where('id', userId).select('id', 'name', 'email').first()
  }

  async list() {
    const dealers = await Dealer.all()

    const dealersWithUser = await Promise.all(
      dealers.map(async (dealer) => {
        const user = await this.getUserData(dealer.userId)
        return {
          ...dealer.toJSON(),
          user,
        }
      })
    )

    return dealersWithUser
  }

  async find(id: number | string) {
    const dealer = await Dealer.query()
      .where('id', id)
      .orWhere('uuid', id)
      .firstOrFail()

    const user = await this.getUserData(dealer.userId)

    return {
      ...dealer.toJSON(),
      user,
    }
  }

  async create(payload: DealerPayload) {
    const dealer = await Dealer.create({
      uuid: uuid(),
      eventId: payload.eventId,
      name: payload.name,
      userId: payload.userId,
    })

    const user = await this.getUserData(dealer.userId)

    return {
      ...dealer.toJSON(),
      user,
    }
  }

  async update(id: number | string, payload: Partial<DealerPayload>) {
    const dealer = await Dealer.query()
      .where('id', id)
      .orWhere('uuid', id)
      .firstOrFail()

    if (payload.eventId) dealer.eventId = payload.eventId
    if (payload.name) dealer.name = payload.name
    if (payload.userId) dealer.userId = payload.userId

    await dealer.save()

    const user = await this.getUserData(dealer.userId)

    return {
      ...dealer.toJSON(),
      user,
    }
  }

  async delete(id: number | string) {
    const dealer = await Dealer.query()
      .where('id', id)
      .orWhere('uuid', id)
      .firstOrFail()

    await dealer.delete()
    return dealer
  }
}
