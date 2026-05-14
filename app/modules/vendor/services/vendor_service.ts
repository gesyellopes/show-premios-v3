import { ValidationException } from '@adonisjs/core/exceptions'
import Vendor from '../models/vendor.js'
import Distributor from '../../distributor/models/distributor.js'
import DistributorCategory from '../../distributor/models/distributor_category.js'

export default class VendorService {
  async list(eventId: number) {
    return Vendor.query().where('event_id', eventId)
  }

  async find(id: number | string) {
    return Vendor.findOrFail(id)
  }

  async create(
    eventId: number,
    payload: { name: string; distributor_id: number; distributor_category_id?: number }
  ) {
    // Validate that distributor_id belongs to the event
    const distributor = await Distributor.query()
      .where('id', payload.distributor_id)
      .where('event_id', eventId)
      .first()

    if (!distributor) {
      throw new ValidationException({
        messages: {
          distributor_id: 'O distribuidor informado não existe para este evento.',
        },
      })
    }

    // Validate distributor_category_id if provided
    if (payload.distributor_category_id) {
      const category = await DistributorCategory.query()
        .where('id', payload.distributor_category_id)
        .where('distributor_id', payload.distributor_id)
        .first()

      if (!category) {
        throw new ValidationException({
          messages: {
            distributor_category_id:
              'A categoria informada não existe para este distribuidor.',
          },
        })
      }
    }

    return Vendor.create({
      eventId,
      name: payload.name,
      distributorId: payload.distributor_id,
      distributorCategoryId: payload.distributor_category_id || null,
    })
  }

  async update(id: number | string, payload: Record<string, unknown>) {
    const vendor = await Vendor.findOrFail(id)
    return vendor.merge(payload).save()
  }

  async delete(id: number | string) {
    const vendor = await Vendor.findOrFail(id)
    return vendor.delete()
  }
}
