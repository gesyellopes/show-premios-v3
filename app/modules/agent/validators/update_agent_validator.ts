import vine from '@vinejs/vine'

export const updateAgentValidator = vine.compile(
  vine.object({
    eventId: vine.number().positive().withoutDecimals().optional(),
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    userId: vine.number().positive().withoutDecimals().optional(),
  })
)
