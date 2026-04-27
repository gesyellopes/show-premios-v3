import db from '@adonisjs/lucid/services/db'
import { META_ENTITIES, type MetaEntity } from '#constants/meta_entities'

type MetaPrimitive = string | number | boolean | object | null

type SetMetaPayload = {
  entity: MetaEntity
  id: number
  key: string
  value: MetaPrimitive
  type?: string
}

type SetManyMetaPayload = {
  entity: MetaEntity
  id: number
  items: Array<{
    key: string
    value: MetaPrimitive
    type?: string
  }>
}

type GetMetaPayload = {
  entity: MetaEntity
  id: number
  key: string
}

type DeleteMetaPayload = {
  entity: MetaEntity
  id: number
  key: string
}

export default class MetaService {
  private static resolveEntity(entity: MetaEntity) {
    return META_ENTITIES[entity]
  }

  private static normalizeValue(value: MetaPrimitive) {
    if (value === null || value === undefined) return null
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  private static parseValue(value: string | null, type: string) {
    if (value === null) return null

    switch (type) {
      case 'number':
        return Number(value)
      case 'boolean':
        return value === 'true'
      case 'json':
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      case 'null':
        return null
      default:
        return value
    }
  }

  private static serializeMetaRow(row: any) {
    return {
      ...row,
      parsedValue: this.parseValue(row.value, row.type),
    }
  }

  static async set({ entity, id, key, value, type = 'string' }: SetMetaPayload) {
    const { table, foreignKey } = this.resolveEntity(entity)
    const normalizedValue = this.normalizeValue(value)

    const existing = await db.from(table).where(foreignKey, id).where('key', key).first()

    if (existing) {
      await db
        .from(table)
        .where('id', existing.id)
        .update({
          value: normalizedValue,
          type,
          updated_at: db.raw('CURRENT_TIMESTAMP'),
        })

      const updated = await db.from(table).where('id', existing.id).first()
      return this.serializeMetaRow(updated)
    }

    const result = await db.table(table).insert({
      [foreignKey]: id,
      key,
      value: normalizedValue,
      type,
      created_at: db.raw('CURRENT_TIMESTAMP'),
      updated_at: null,
    })

    const createdId = Array.isArray(result) ? result[0] : result

    const created = await db.from(table).where('id', createdId).first()
    return this.serializeMetaRow(created)
  }

  static async setMany({ entity, id, items }: SetManyMetaPayload) {
    const results = []

    for (const item of items) {
      if (!item?.key) continue

      const result = await this.set({
        entity,
        id,
        key: item.key,
        value: item.value ?? null,
        type: item.type ?? 'string',
      })

      results.push(result)
    }

    return results
  }

  static async get({ entity, id, key }: GetMetaPayload) {
    const { table, foreignKey } = this.resolveEntity(entity)

    const row = await db.from(table).where(foreignKey, id).where('key', key).first()

    if (!row) return null

    return this.serializeMetaRow(row)
  }

  static async getAll(entity: MetaEntity, id: number) {
    const { table, foreignKey } = this.resolveEntity(entity)

    const rows = await db.from(table).where(foreignKey, id).orderBy('id', 'asc')

    return rows.map((row) => this.serializeMetaRow(row))
  }

  static async delete({ entity, id, key }: DeleteMetaPayload) {
    const { table, foreignKey } = this.resolveEntity(entity)

    return await db.from(table).where(foreignKey, id).where('key', key).delete()
  }

  static async deleteMany(entity: MetaEntity, id: number, keys: string[]) {
    const { table, foreignKey } = this.resolveEntity(entity)

    return await db.from(table).where(foreignKey, id).whereIn('key', keys).delete()
  }

  static async has(entity: MetaEntity, id: number, key: string) {
    const meta = await this.get({ entity, id, key })
    return !!meta
  }
}