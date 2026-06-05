import type { HttpContext } from '@adonisjs/core/http'
import UserService from '../services/user_service.js'
import AuthService from '../services/auth_service.js'
import { createUserValidator } from '../validators/create_user_validator.js'
import { updateUserValidator } from '../validators/update_user_validator.js'
import { loginValidator } from '../validators/login_validator.js'

export default class UsersController {
  async index({ response }: HttpContext) {
    const service = new UserService()
    const users = await service.list()
    return response.ok({ data: users })
  }

  async show({ params, response }: HttpContext) {
    const service = new UserService()
    const user = await service.find(params.id)
    return response.ok({ data: user })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const service = new UserService()
    const user = await service.create(payload)
    return response.created({ data: user })
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator)
    const service = new UserService()
    const user = await service.update(params.id, payload)
    return response.ok({ data: user })
  }

  async destroy({ params, response }: HttpContext) {
    const service = new UserService()
    await service.delete(params.id)
    return response.ok({ success: true })
  }

  async login({ request, response }: HttpContext) {
    const { login, password } = await request.validateUsing(loginValidator)
    const authService = new AuthService()
    const token = await authService.login(login, password)
    return response.ok({ data: token })
  }
}
