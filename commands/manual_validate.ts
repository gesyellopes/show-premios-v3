import { BaseCommand } from '@adonisjs/core/ace'
import app from '@adonisjs/core/services/app'
import { readdir, readFile, rm } from 'node:fs/promises'
import { join, extname } from 'node:path'
import WebhookTicketService from '../app/modules/ticket/services/webhook_service.ts'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class ManualValidate extends BaseCommand {
  static commandName = 'manual:validate'
  static description = 'Valida arquivos JSON locais da pasta webhook-files'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const webhookFilesPath = join(process.cwd(), 'webhook-files')

    try {
      const files = await readdir(webhookFilesPath)
      const jsonFiles = files.filter((file) => extname(file).toLowerCase() === '.json')

      if (jsonFiles.length === 0) {
        this.logger.info('ℹ️  Nenhum arquivo JSON encontrado em webhook-files')
        return
      }

      this.logger.info(`📁 Encontrados ${jsonFiles.length} arquivos para processar`)

      let successCount = 0
      let failureCount = 0

      for (const file of jsonFiles) {
        const messageId = file.replace('.json', '')
        const filePath = join(webhookFilesPath, file)

        try {
          this.logger.info(`⚙️  Processando: ${file}`)

          const content = await readFile(filePath, 'utf-8')
          const service = await app.container.make(WebhookTicketService)
          const result = await service.executeFromPayload(messageId, content)

          if (result.success || (!result.retry && !result.error)) {
            this.logger.success(`✅ Sucesso: ${file}`)
            await rm(filePath)
            successCount++
          } else if (result.retry) {
            this.logger.warning(`⚠️  Retry necessário: ${file} - ${result.error}`)
            failureCount++
          } else {
            this.logger.error(`❌ Falha: ${file} - ${result.error}`)
            failureCount++
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Erro desconhecido'
          this.logger.error(`❌ Erro ao processar ${file}: ${msg}`)
          failureCount++
        }
      }

      this.logger.info(`\n📊 Resumo: ${successCount} sucesso(s), ${failureCount} falha(s)`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido'
      this.logger.error(`❌ Erro ao acessar pasta webhook-files: ${msg}`)
    }
  }
}
