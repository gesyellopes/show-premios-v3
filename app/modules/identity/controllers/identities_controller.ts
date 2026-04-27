import type { HttpContext } from '@adonisjs/core/http'
import IdentityService from '../services/identity_service.js'
import { registerValidator } from '../validators/register_validator.js'
import { publicRegisterValidator } from '../validators/public_register_validator.ts'

export default class IdentitiesController {
  protected identityService = new IdentityService()

  /**
   * Registro Público: Role é forçada internamente como 'user'
   */
  async publicRegister({ request, response }: HttpContext) {
    // Aqui você pode usar um validator que NEM POSSUI o campo 'role'
    const payload = await request.validateUsing(publicRegisterValidator)

    // Passamos 'user' como segundo argumento para ignorar qualquer tentativa de injetar role
    const { user } = await this.identityService.register(payload, 'user')

    return response.created({ message: 'Conta criada!', uuid: user.uuid })
  }

  /**
   * Registro Administrativo: Aceita a role vinda do payload
   */
  async store({ request, response }: HttpContext) {
    // Validação
    const payload = await request.validateUsing(registerValidator)

    // Execução no Service
    const { user } = await this.identityService.register(payload)

    return response.created({
      message: 'Conta criada com sucesso',
      data: {
        uuid: user.uuid,
        role: user.role,
      },
    })
  }

  /**
   * Buscar dados da identidade pelo UUID
   */
  async show({ params, response }: HttpContext) {
    const user = await this.identityService.findByUuid(params.id)

    return response.ok({
      data: {
        uuid: user.uuid,
        role: user.role,
        email: user.email,
        profile: {
          fullName: user.person.fullName,
          email: user.person.email,
          phone: user.person.phone,
        },
      },
    })
  }
}
