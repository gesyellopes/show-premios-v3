import vine from '@vinejs/vine'

export const updateEventValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255).optional(),
    draw: vine.number().positive().max(999999999).optional(),
    prefix: vine.string().trim().minLength(1).maxLength(2).optional(),
  })
)
