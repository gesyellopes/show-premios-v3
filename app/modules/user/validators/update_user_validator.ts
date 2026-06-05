import vine from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(255)
      .optional(),
    phone: vine
      .string()
      .regex(/^\d{10,11}$/)
      .optional(),
    password: vine
      .string()
      .minLength(8)
      .optional(),
    role: vine
      .enum(['admin', 'manager', 'vendor'])
      .optional(),
  })
)
