import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    // Dados da Person
    fullName: vine.string().trim().minLength(3).maxLength(255).meta({
      placeholder: 'teste',
    }),
    email: vine.string().email().trim().unique({ table: 'persons', column: 'email' }),
    phone: vine.string().mobile().optional(),

    // Dados do User
    password: vine.string().minLength(8).confirmed(),
    role: vine.string().optional(), // Você pode travar isso no Service por segurança
  })
)
