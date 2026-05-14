import vine from '@vinejs/vine'

export const createVendorValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    distributor_id: vine.number().positive(),
    distributor_category_id: vine.number().positive().optional(),
  })
)
