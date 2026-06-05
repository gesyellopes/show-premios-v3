import vine from '@vinejs/vine'

export const createAgentValidator = vine.compile(
  vine.object({
    eventId: vine.number().positive().withoutDecimals(),
    name: vine.string().trim().minLength(3).maxLength(255),
    userId: vine.number().positive().withoutDecimals(),
  })
)
