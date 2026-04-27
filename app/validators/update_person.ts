import vine from '@vinejs/vine'

const metaSchema = vine
  .array(
    vine.object({
      key: vine.string().trim().minLength(1).maxLength(100),
      value: vine.any(),
      type: vine.string().trim().maxLength(30).optional(),
    })
  )
  .optional()

export const updatePersonValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3).maxLength(150).optional(),
    displayName: vine.string().trim().maxLength(150).optional(),
    birthDate: vine.string().trim().optional(),
    phone: vine.string().trim().maxLength(30).optional(),
    email: vine.string().trim().email().maxLength(150).optional(),
    gender: vine.string().trim().maxLength(30).optional(),
    status: vine.string().trim().maxLength(30).optional(),
    notes: vine.string().trim().optional(),
    meta: metaSchema,
  })
)