import crypto from 'node:crypto'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'

import Person from '#models/person'
import MetaService from '#services/meta_service'
import SearchService from '#services/search_service'
import { createPersonValidator } from '#validators/create_person'
import { updatePersonValidator } from '#validators/update_person'

export default class PersonsController {
    async index({ request, response }: HttpContext) {
        const page = Number(request.input('page', 1))
        const limit = Number(request.input('limit', 10))
        const withMeta = String(request.input('withMeta', 'false')) === 'true'

        const persons = await SearchService.paginate({
            model: Person,
            page,
            limit,
            where: [{ column: 'deleted_at', operator: 'is', value: null }],
            orderBy: [{ column: 'id', direction: 'desc' }],
        })

        if (!withMeta) {
            return response.ok(persons)
        }

        const rows = persons.all()
        const rowsWithMeta = await Promise.all(
            rows.map(async (person: any) => {
                const meta = await MetaService.getAll('person', person.id)
                return {
                    ...person.serialize(),
                    meta,
                }
            })
        )

        return response.ok({
            meta: persons.getMeta(),
            data: rowsWithMeta,
        })
    }

    async show({ params, request, response }: HttpContext) {
        const withMeta = String(request.input('withMeta', 'true')) === 'true'

        const person = await Person.query().where('id', params.id).whereNull('deleted_at').first()

        if (!person) {
            return response.notFound({ message: 'Person not found' })
        }

        if (!withMeta) {
            return response.ok({ data: person })
        }

        const meta = await MetaService.getAll('person', person.id)

        return response.ok({
            data: person,
            meta,
        })
    }

    async store({ request, response }: HttpContext) {
        const payload = await request.validateUsing(createPersonValidator)

        const person = await Person.create({
            uuid: crypto.randomUUID(),
            fullName: payload.fullName,
            displayName: payload.displayName,
            birthDate: payload.birthDate ? DateTime.fromISO(payload.birthDate) : null,
            phone: payload.phone,
            email: payload.email,
            gender: payload.gender,
            status: payload.status ?? 'active',
            notes: payload.notes,
        })

        if (payload.meta?.length) {
            await MetaService.setMany({
                entity: 'person',
                id: person.id,
                items: payload.meta.map((item) => ({
                    key: item.key,
                    value: item.value ?? null,
                    type: item.type ?? 'string',
                })),
            })
        }

        const meta = await MetaService.getAll('person', person.id)

        return response.created({
            message: 'Person created successfully',
            data: person,
            meta,
        })
    }

    async update({ params, request, response }: HttpContext) {
        const payload = await request.validateUsing(updatePersonValidator)

        const person = await Person.query().where('id', params.id).whereNull('deleted_at').first()

        if (!person) {
            return response.notFound({ message: 'Person not found' })
        }

        person.merge({
            fullName: payload.fullName,
            displayName: payload.displayName,
            birthDate: payload.birthDate ? DateTime.fromISO(payload.birthDate) : null,
            phone: payload.phone,
            email: payload.email,
            gender: payload.gender,
            status: payload.status,
            notes: payload.notes,
        })

        await person.save()

        if (payload.meta?.length) {
            await MetaService.setMany({
                entity: 'person',
                id: person.id,
                items: payload.meta.map((item) => ({
                    key: item.key,
                    value: item.value ?? null,
                    type: item.type ?? 'string',
                })),
            })
        }

        const meta = await MetaService.getAll('person', person.id)

        return response.ok({
            message: 'Person updated successfully',
            data: person,
            meta,
        })
    }

    async destroy({ params, response }: HttpContext) {
        const person = await Person.query().where('id', params.id).whereNull('deleted_at').first()

        if (!person) {
            return response.notFound({ message: 'Person not found' })
        }

        person.deletedAt = DateTime.now()
        await person.save()

        return response.ok({
            message: 'Person deleted successfully',
        })
    }
}