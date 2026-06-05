import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    login: vine.string().trim(),
    password: vine.string().minLength(8),
  })
)
