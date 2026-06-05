import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      })
      .optional(),
    phone: vine
      .string()
      .regex(/^\d{10,11}$/),
    password: vine.string().minLength(8),
    role: vine.enum(['admin', 'manager', 'vendor']).optional(),
  })
)
