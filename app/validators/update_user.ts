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

export const updateUserValidator = vine.compile(
  vine.object({
    personId: vine.number().positive().optional(),
    username: vine.string().trim().minLength(3).maxLength(80).optional(),
    email: vine.string().trim().email().maxLength(150).optional(),
    phone: vine.string().trim().maxLength(30).optional(),
    password: vine.string().minLength(6).maxLength(255).optional(),
    status: vine.string().trim().maxLength(30).optional(),
    role: vine.string().trim().maxLength(50).optional(),
    meta: metaSchema,
  })
)