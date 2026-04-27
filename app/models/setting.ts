import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Setting extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare key: string

    @column()
    declare value: string | null

    @column()
    declare type: 'string' | 'number' | 'boolean' | 'json' | 'secret'

    @column()
    declare group: string | null

    @column()
    declare tag: string | null

    @column()
    declare isPublic: boolean

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @column.dateTime()
    declare deletedAt: DateTime | null
}