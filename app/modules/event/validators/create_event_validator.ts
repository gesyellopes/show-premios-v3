import vine from '@vinejs/vine'

export const createEventValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    draw: vine.number().positive().max(999999999),
    prefix: vine.string().trim().minLength(1).maxLength(2),
  })
)
