import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import string from '@adonisjs/core/helpers/string' // 👈 import estático

export default class DeleteModuleCommand extends BaseCommand {
  static commandName = 'delete:module'
  static description = 'Remove a module scaffold from app/modules'

  @args.string({
    description: 'Module name. Example: notifications, users, chat',
  })
  declare moduleName: string

  @flags.boolean({
    description: 'Skip confirmation prompt',
    default: false,
  })
  declare force: boolean

  async run() {
    const folderName = this.resolveFolderName(this.moduleName)
    const moduleBasePath = this.app.makePath(`app/modules/${folderName}`)

    if (!existsSync(moduleBasePath)) {
      this.logger.error(`Module "${folderName}" does not exist`)
      this.exitCode = 1
      return
    }

    if (!this.force) {
      const confirmed = await this.prompt.confirm(
        `Are you sure you want to delete module "${folderName}"? This cannot be undone.`
      )
      if (!confirmed) {
        this.logger.info('Aborted.')
        return
      }
    }

    rmSync(moduleBasePath, { recursive: true, force: true })
    this.removeRouteImport(folderName)

    this.logger.success(`Module "${folderName}" deleted successfully`)
  }

  private resolveFolderName(moduleName: string): string {
    // Reutiliza a mesma lógica de normalização do make:module
    const normalized = string.snakeCase(moduleName.trim()).replace(/_/g, '-')
    //return string.plural(normalized)
    return normalized
  }

  private removeRouteImport(folderName: string) {
    const routesFilePath = this.app.makePath('start/routes.ts')

    if (!existsSync(routesFilePath)) return

    const current = readFileSync(routesFilePath, 'utf8')
    const importLine = `import '#modules/${folderName}/routes.js'\n`

    if (!current.includes(importLine)) {
      this.logger.warning(`Route import for "${folderName}" not found in start/routes.ts`)
      return
    }

    writeFileSync(routesFilePath, current.replace(importLine, ''), 'utf8')
    this.logger.info(`Removed route import from start/routes.ts`)
  }
}
