import crypto from 'node:crypto'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import MetaService from '#services/meta_service'
import SearchService from '#services/search_service'
import { createUserValidator } from '#validators/create_user'
import { updateUserValidator } from '#validators/update_user'

export default class UsersController {
  async index({ request, response }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))
    const withMeta = String(request.input('withMeta', 'false')) === 'true'

    const users = await SearchService.paginate({
      model: User,
      page,
      limit,
      where: [{ column: 'deleted_at', operator: 'is', value: null }],
      orderBy: [{ column: 'id', direction: 'desc' }],
    })

    if (!withMeta) {
      return response.ok(users)
    }

    const rows = users.all()
    const rowsWithMeta = await Promise.all(
      rows.map(async (user: any) => {
        const meta = await MetaService.getAll('user', user.id)
        return {
          ...user.serialize(),
          meta,
        }
      })
    )

    return response.ok({
      meta: users.getMeta(),
      data: rowsWithMeta,
    })
  }

  async show({ params, request, response }: HttpContext) {
    const withMeta = String(request.input('withMeta', 'true')) === 'true'

    const user = await User.query().where('id', params.id).whereNull('deleted_at').first()

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    if (!withMeta) {
      return response.ok({ data: user })
    }

    const meta = await MetaService.getAll('user', user.id)

    return response.ok({
      data: user,
      meta,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    const user = await User.create({
      uuid: crypto.randomUUID(),
      personId: payload.personId,
      username: payload.username,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      status: payload.status ?? 'active',
      role: payload.role ?? 'user',
    })

    if (payload.meta?.length) {
      await MetaService.setMany({
        entity: 'user',
        id: user.id,
        items: payload.meta.map((item) => ({
          key: item.key,
          value: item.value ?? null,
          type: item.type ?? 'string',
        })),
      })
    }

    const meta = await MetaService.getAll('user', user.id)

    return response.created({
      message: 'User created successfully',
      data: user,
      meta,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator)

    const user = await User.query().where('id', params.id).whereNull('deleted_at').first()

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    user.merge({
      personId: payload.personId,
      username: payload.username,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      status: payload.status,
      role: payload.role,
    })

    await user.save()

    if (payload.meta?.length) {
      await MetaService.setMany({
        entity: 'user',
        id: user.id,
        items: payload.meta.map((item) => ({
          key: item.key,
          value: item.value ?? null,
          type: item.type ?? 'string',
        })),
      })
    }

    const meta = await MetaService.getAll('user', user.id)

    return response.ok({
      message: 'User updated successfully',
      data: user,
      meta,
    })
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.query().where('id', params.id).whereNull('deleted_at').first()

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    user.deletedAt = DateTime.now()
    await user.save()

    return response.ok({
      message: 'User deleted successfully',
    })
  }
}