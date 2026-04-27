// app/modules/ticket/constants/index.ts

export const TICKET_CODES = {
  MAX_ATTEMPTS: 'ticket_max_attempts',
  ALREADY_VALIDATED: 'ticket_already_validated',
  ERROR_FILE_DELETED: 'ticket_file_delete_error',
  PAYLOAD_NOT_FOUND: 'ticket_payload_not_found',
  IS_NOT_IMAGE: 'ticket_is_not_image',
  ERROR_DOWNLOAD_MEDIA: 'ticket_error_download_media',
  ERROR_UPLOAD_MEDIA: 'ticket_error_upload_media',
} as const

export type TicketCode = (typeof TICKET_CODES)[keyof typeof TICKET_CODES]
