import vine from '@vinejs/vine'

export const bulkUpdateTicketsValidator = vine.compile(
  vine.object({
    event_id: vine.number().positive(),
    distributor_id: vine.number().positive().optional(),
    vendor_id: vine.number().positive().optional(),
    distributor_category_id: vine.number().positive().optional(),
  })
)
