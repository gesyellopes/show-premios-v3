// app/controllers/settings_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import settings from '#services/settings'
import Setting from '#models/setting'

const ALLOWED_TYPES = ['string', 'number', 'boolean', 'json', 'secret'] as const
type SettingType = (typeof ALLOWED_TYPES)[number]

type BatchItem = {
    key: string
    value: unknown
    type?: SettingType
    group?: string | null
    tag?: string | null
}

export default class SettingsController {
    /**
     * Lista settings com filtros opcionais:
     * /settings
     * /settings?group=whatsapp
     * /settings?tag=wp-api
     * /settings?group=whatsapp&tag=wp-api
     */
    async index({ request, response }: HttpContext) {
        const group = request.input('group')
        const tag = request.input('tag')

        const query = Setting.query()
            .whereNull('deleted_at')
            .orderBy('group', 'asc')
            .orderBy('tag', 'asc')
            .orderBy('key', 'asc')

        if (group) {
            query.where('group', String(group).trim())
        }

        if (tag) {
            query.where('tag', String(tag).trim())
        }

        const rows = await query

        return response.ok({
            success: true,
            filters: {
                group: group ? String(group).trim() : null,
                tag: tag ? String(tag).trim() : null,
            },
            data: rows,
        })
    }

    /**
     * Busca uma configuração por key
     * Exemplo: /settings/system.app_name
     */
    async show({ params, response }: HttpContext) {
        const key = String(params.key || '').trim()

        if (!key) {
            return response.badRequest({
                success: false,
                message: 'A key é obrigatória',
            })
        }

        const row = await Setting.query()
            .where('key', key)
            .whereNull('deleted_at')
            .first()

        if (!row) {
            return response.notFound({
                success: false,
                message: `Setting '${key}' não encontrada`,
            })
        }

        const value = settings.get(key)

        return response.ok({
            success: true,
            data: {
                key: row.key,
                value,
                type: row.type,
                group: row.group,
                tag: row.tag,
                isPublic: row.isPublic,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
            },
        })
    }

    /**
     * Cria ou atualiza uma configuração
     */
    async store({ request, response }: HttpContext) {
        const payload = request.only(['key', 'value', 'type', 'group', 'tag'])

        const key = String(payload.key || '').trim()
        const type = String(payload.type || 'string').trim() as SettingType
        const group = payload.group ? String(payload.group).trim() : null
        const tag = payload.tag ? String(payload.tag).trim() : null
        const value = payload.value

        if (!key) {
            return response.badRequest({
                success: false,
                message: 'O campo key é obrigatório',
            })
        }

        if (!ALLOWED_TYPES.includes(type)) {
            return response.badRequest({
                success: false,
                message: `Tipo inválido. Tipos aceitos: ${ALLOWED_TYPES.join(', ')}`,
            })
        }

        try {
            const updated = await settings.set(key, value, type, group, tag)

            return response.ok({
                success: true,
                message: 'Setting salva com sucesso',
                data: {
                    key,
                    value: updated,
                    type,
                    group,
                    tag,
                },
            })
        } catch (error: any) {
            return response.internalServerError({
                success: false,
                message: 'Erro ao salvar setting',
                error: error.message,
            })
        }
    }

    /**
     * Atualiza uma configuração existente por key
     */
    async update({ params, request, response }: HttpContext) {
        const key = String(params.key || '').trim()

        if (!key) {
            return response.badRequest({
                success: false,
                message: 'A key é obrigatória',
            })
        }

        const payload = request.only(['value', 'type', 'group', 'tag'])

        if (
            payload.type !== undefined &&
            !ALLOWED_TYPES.includes(String(payload.type).trim() as SettingType)
        ) {
            return response.badRequest({
                success: false,
                message: `Tipo inválido. Tipos aceitos: ${ALLOWED_TYPES.join(', ')}`,
            })
        }

        try {
            const updated = await settings.patch({
                key,
                ...(Object.prototype.hasOwnProperty.call(payload, 'value') ? { value: payload.value } : {}),
                ...(payload.type !== undefined ? { type: String(payload.type).trim() as SettingType } : {}),
                ...(Object.prototype.hasOwnProperty.call(payload, 'group') ? { group: payload.group ? String(payload.group).trim() : null } : {}),
                ...(Object.prototype.hasOwnProperty.call(payload, 'tag') ? { tag: payload.tag ? String(payload.tag).trim() : null } : {}),
            })

            return response.ok({
                success: true,
                message: 'Setting atualizada com sucesso',
                data: updated,
            })
        } catch (error: any) {
            if (String(error.message || '').includes('não encontrada')) {
                return response.notFound({
                    success: false,
                    message: error.message,
                })
            }

            return response.internalServerError({
                success: false,
                message: 'Erro ao atualizar setting',
                error: error.message,
            })
        }
    }

    /**
     * Soft delete por key
     */
    async destroy({ params, response }: HttpContext) {
        const key = String(params.key || '').trim()

        if (!key) {
            return response.badRequest({
                success: false,
                message: 'A key é obrigatória',
            })
        }

        try {
            const removed = await settings.remove(key)

            if (!removed) {
                return response.notFound({
                    success: false,
                    message: `Setting '${key}' não encontrada`,
                })
            }

            return response.ok({
                success: true,
                message: 'Setting removida com sucesso',
                data: {
                    key,
                },
            })
        } catch (error: any) {
            return response.internalServerError({
                success: false,
                message: 'Erro ao remover setting',
                error: error.message,
            })
        }
    }

    /**
     * Recarrega cache do banco
     */
    async refresh({ response }: HttpContext) {
        try {
            await settings.refresh()

            return response.ok({
                success: true,
                message: 'Cache de settings recarregado com sucesso',
            })
        } catch (error: any) {
            return response.internalServerError({
                success: false,
                message: 'Erro ao recarregar settings',
                error: error.message,
            })
        }
    }

    /**
     * UPSERT EM LOTE
     * body:
     * {
     *   "items": [
     *     {
     *       "key": "whatsapp.default_provider",
     *       "value": "wp-api",
     *       "type": "string",
     *       "group": "whatsapp",
     *       "tag": "default"
     *     }
     *   ]
     * }
     */
    async bulkUpsert({ request, response }: HttpContext) {
        const items = request.input('items')

        if (!Array.isArray(items) || items.length === 0) {
            return response.badRequest({
                success: false,
                message: 'O campo items deve ser um array com pelo menos um item',
            })
        }

        const results: Array<any> = []
        const errors: Array<any> = []

        for (let index = 0; index < items.length; index++) {
            const item = items[index] as BatchItem

            const key = String(item?.key || '').trim()
            const type = String(item?.type || 'string').trim() as SettingType
            const group = item?.group ? String(item.group).trim() : null
            const tag = item?.tag ? String(item.tag).trim() : null
            const value = item?.value

            if (!key) {
                errors.push({
                    index,
                    key: null,
                    message: 'O campo key é obrigatório',
                })
                continue
            }

            if (!ALLOWED_TYPES.includes(type)) {
                errors.push({
                    index,
                    key,
                    message: `Tipo inválido. Tipos aceitos: ${ALLOWED_TYPES.join(', ')}`,
                })
                continue
            }

            try {
                const updated = await settings.set(key, value, type, group, tag)

                results.push({
                    index,
                    key,
                    value: updated,
                    type,
                    group,
                    tag,
                    success: true,
                })
            } catch (error: any) {
                errors.push({
                    index,
                    key,
                    message: error.message,
                })
            }
        }

        return response.ok({
            success: errors.length === 0,
            message:
                errors.length === 0
                    ? 'Lote processado com sucesso'
                    : 'Lote processado com erros parciais',
            data: {
                total: items.length,
                successCount: results.length,
                errorCount: errors.length,
                items: results,
                errors,
            },
        })
    }

    //Edição em Lote
    async bulkPatch({ request, response }: HttpContext) {
        const items = request.input('items')

        if (!Array.isArray(items) || items.length === 0) {
            return response.badRequest({
                success: false,
                message: 'O campo items deve ser um array com pelo menos um item',
            })
        }

        const results: any[] = []
        const errors: any[] = []

        for (let index = 0; index < items.length; index++) {
            const item = items[index]
            const key = String(item?.key || '').trim()

            if (!key) {
                errors.push({
                    index,
                    key: null,
                    message: 'O campo key é obrigatório',
                })
                continue
            }

            if (
                item?.type !== undefined &&
                !ALLOWED_TYPES.includes(String(item.type).trim() as SettingType)
            ) {
                errors.push({
                    index,
                    key,
                    message: `Tipo inválido. Tipos aceitos: ${ALLOWED_TYPES.join(', ')}`,
                })
                continue
            }

            try {
                const updated = await settings.patch({
                    key,
                    ...(Object.prototype.hasOwnProperty.call(item, 'value') ? { value: item.value } : {}),
                    ...(item.type !== undefined ? { type: String(item.type).trim() as SettingType } : {}),
                    ...(Object.prototype.hasOwnProperty.call(item, 'group') ? { group: item.group ? String(item.group).trim() : null } : {}),
                    ...(Object.prototype.hasOwnProperty.call(item, 'tag') ? { tag: item.tag ? String(item.tag).trim() : null } : {}),
                })

                results.push({
                    index,
                    success: true,
                    ...updated,
                })
            } catch (error: any) {
                errors.push({
                    index,
                    key,
                    message: error.message,
                })
            }
        }

        return response.ok({
            success: errors.length === 0,
            message:
                errors.length === 0
                    ? 'Lote atualizado com sucesso'
                    : 'Lote atualizado com erros parciais',
            data: {
                total: items.length,
                successCount: results.length,
                errorCount: errors.length,
                items: results,
                errors,
            },
        })
    }

    /**
     * DELETE EM LOTE
     * body:
     * {
     *   "keys": [
     *     "whatsapp.providers.wp_api.instance_id",
     *     "whatsapp.providers.wp_api.instance_token"
     *   ]
     * }
     */
    async bulkDelete({ request, response }: HttpContext) {
        const keys = request.input('keys')

        if (!Array.isArray(keys) || keys.length === 0) {
            return response.badRequest({
                success: false,
                message: 'O campo keys deve ser um array com pelo menos uma key',
            })
        }

        const results: Array<any> = []
        const errors: Array<any> = []

        for (let index = 0; index < keys.length; index++) {
            const key = String(keys[index] || '').trim()

            if (!key) {
                errors.push({
                    index,
                    key: null,
                    message: 'Key inválida',
                })
                continue
            }

            try {
                const removed = await settings.remove(key)

                if (!removed) {
                    errors.push({
                        index,
                        key,
                        message: 'Setting não encontrada',
                    })
                    continue
                }

                results.push({
                    index,
                    key,
                    success: true,
                })
            } catch (error: any) {
                errors.push({
                    index,
                    key,
                    message: error.message,
                })
            }
        }

        return response.ok({
            success: errors.length === 0,
            message:
                errors.length === 0
                    ? 'Remoção em lote concluída com sucesso'
                    : 'Remoção em lote concluída com erros parciais',
            data: {
                total: keys.length,
                successCount: results.length,
                errorCount: errors.length,
                items: results,
                errors,
            },
        })
    }
}