// app/services/settings_service.ts
import { DateTime } from 'luxon'
import Setting from '#models/setting'
import encryption from '@adonisjs/core/services/encryption'

type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'secret'

type CacheEntry = {
  key: string
  rawValue: string | null
  type: SettingType
  group: string | null
  tag: string | null
}

type PatchSettingInput = {
  key: string
  value?: unknown
  type?: SettingType
  group?: string | null
  tag?: string | null
}

export default class SettingsService {
  private cache = new Map<string, CacheEntry>()
  private loaded = false

  public async load() {
    //const rows = await Setting.all()
    const rows = await Setting.query()
      .whereNull('deleted_at') //SoftDeete

    this.cache.clear()

    for (const row of rows) {
      this.cache.set(row.key, {
        key: row.key,
        rawValue: row.value,
        type: row.type,
        group: row.group,
        tag: row.tag,
      })
    }

    this.loaded = true
  }

  public async refresh() {
    await this.load()
  }

  public isLoaded() {
    return this.loaded
  }

  public all() {
    const output: Record<string, unknown> = {}

    for (const [key, item] of this.cache.entries()) {
      output[key] = this.cast(item.rawValue, item.type)
    }

    return output
  }

  public get<T = unknown>(key: string, fallback?: T): T {
    const item = this.cache.get(key)

    if (!item) {
      return fallback as T
    }

    return this.cast(item.rawValue, item.type) as T
  }

  public has(key: string): boolean {
    return this.cache.has(key)
  }

  async set(
    key: string,
    value: unknown,
    type: SettingType = 'string',
    group?: string | null,
    tag?: string | null
  ) {
    let row = await Setting.findBy('key', key)
    const rawValue = this.serialize(value, type)

    if (row) {
      row.merge({
        value: rawValue,
        type,
        group: group ?? null,
        tag: tag ?? null,
        deletedAt: null,
      })
      await row.save()
    } else {
      row = await Setting.create({
        key,
        value: rawValue,
        type,
        group: group ?? null,
        tag: tag ?? null,
      })
    }

    this.cache.set(key, {
      key: row.key,
      rawValue: row.value,
      type: row.type as SettingType,
      group: row.group,
      tag: row.tag,
    })

    return this.cast(row.value, row.type as SettingType)
  }

  async patch(input: PatchSettingInput) {
    const key = String(input.key || '').trim()

    if (!key) {
      throw new Error('A key é obrigatória')
    }

    let row = await Setting.findBy('key', key)

    if (!row) {
      throw new Error(`Setting '${key}' não encontrada`)
    }

    const nextType = input.type ?? (row.type as SettingType)

    // value:
    // - se veio no payload, usa o novo valor
    // - se não veio, preserva o valor atual do banco
    let nextRawValue = row.value

    if ('value' in input) {
      nextRawValue = this.serialize(input.value, nextType)
    }

    row.merge({
      value: nextRawValue,
      type: nextType,
      group: input.group !== undefined ? input.group : row.group,
      tag: input.tag !== undefined ? input.tag : row.tag,
      deletedAt: null,
    })

    await row.save()

    this.cache.set(key, {
      key: row.key,
      rawValue: row.value,
      type: row.type as SettingType,
      group: row.group,
      tag: row.tag,
    })

    return {
      key: row.key,
      value: this.cast(row.value, row.type as SettingType),
      type: row.type,
      group: row.group,
      tag: row.tag,
    }
  }

  async remove(key: string): Promise<boolean> {
    const row = await Setting.query()
      .where('key', key)
      .whereNull('deleted_at') // 👈 IMPORTANTE
      .first()

    // ❌ não encontrou
    if (!row) {
      return false
    }

    // 🧠 soft delete
    row.deletedAt = DateTime.now()
    await row.save()

    // 🔥 remove do cache
    this.cache.delete(key)

    return true
  }

  private cast(value: string | null, type: SettingType): unknown {
    if (value === null) return null

    switch (type) {
      case 'number':
        return Number(value)

      case 'boolean':
        return value === 'true'

      case 'json':
        return JSON.parse(value)

      case 'secret':
        return encryption.decrypt(value)

      case 'string':
      default:
        return value
    }
  }

  private serialize(value: unknown, type: SettingType): string {
    switch (type) {
      case 'number':
        return String(value)

      case 'boolean':
        return value ? 'true' : 'false'

      case 'json':
        return JSON.stringify(value)

      case 'secret':
        return encryption.encrypt(String(value))

      case 'string':
      default:
        return String(value)
    }
  }
}