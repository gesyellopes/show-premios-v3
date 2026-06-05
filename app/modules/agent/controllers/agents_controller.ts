import type { HttpContext } from '@adonisjs/core/http'
import AgentService from '../services/agent_service.js'
import { createAgentValidator } from '../validators/create_agent_validator.js'
import { updateAgentValidator } from '../validators/update_agent_validator.js'

export default class AgentsController {
  protected agentService = new AgentService()

  async index({ response }: HttpContext) {
    try {
      const agents = await this.agentService.list()
      return response.ok({
        success: true,
        data: agents,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Erro ao listar agents',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const agent = await this.agentService.find(params.id)
      return response.ok({
        success: true,
        data: agent,
      })
    } catch (error) {
      return response.notFound({
        success: false,
        message: 'Agent não encontrado',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createAgentValidator)
      const agent = await this.agentService.create(payload)
      return response.created({
        success: true,
        data: agent,
        message: 'Agent criado com sucesso',
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erro ao criar agent',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateAgentValidator)
      const agent = await this.agentService.update(params.id, payload)
      return response.ok({
        success: true,
        data: agent,
        message: 'Agent atualizado com sucesso',
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erro ao atualizar agent',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.agentService.delete(params.id)
      return response.ok({
        success: true,
        data: result,
        message: 'Agent deletado com sucesso',
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erro ao deletar agent',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }
}
