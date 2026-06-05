import vine from '@vinejs/vine'

export const updateDealerValidator = vine.compile(
  vine.object({
    eventId: vine.number().positive().optional(),
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    userId: vine.number().positive().optional(),
  })
)
