import vine from '@vinejs/vine'

export const createDealerValidator = vine.compile(
  vine.object({
    eventId: vine.number().positive(),
    name: vine.string().trim().minLength(3).maxLength(255),
    userId: vine.number().positive(),
  })
)
