import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import string from '@adonisjs/core/helpers/string'
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

type IntegrationNames = {
  raw: string
  folder: string
  singularPascal: string
  pluralPascal: string
  singularSnake: string
  singularKebab: string
  pluralKebab: string
}

export default class MakeIntegrationCommand extends BaseCommand {
  static commandName = 'make:integration'
  static description = 'Create an integration scaffold inside app/integrations'

  @args.string({
    description: 'Integration name. Example: resend-mail, firebase-push, stripe',
  })
  declare integrationName: string

  @flags.boolean({
    description: 'Skip confirmation and overwrite if exists',
    default: false,
  })
  declare force: boolean

  @flags.boolean({
    description: 'Print what would be created without writing anything to disk',
    default: false,
  })
  declare dryRun: boolean

  async run() {
    const names = this.makeNames(this.integrationName)
    const basePath = this.app.makePath(`app/integrations/${names.folder}`)

    if (existsSync(basePath) && !this.force) {
      this.logger.error(`Integration "${names.folder}" already exists. Use --force to overwrite.`)
      this.exitCode = 1
      return
    }

    if (this.dryRun) {
      this.printDryRun(basePath, names)
      return
    }

    this.ensureDir(basePath)
    this.writeFiles(basePath, names)
    this.appendToIndex(names)

    this.logger.success(`Integration "${names.folder}" created successfully`)
    this.logger.info(`Path: ${basePath}`)
  }

  private makeNames(raw: string): IntegrationNames {
    raw = raw.trim()

    if (!raw) throw new Error('You must provide an integration name')
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(raw)) {
      throw new Error(`Invalid integration name: "${raw}". Use only letters, numbers, hyphens and underscores.`)
    }

    const normalized = string.snakeCase(raw).replace(/_/g, '-')
    const singularKebab = string.singular(normalized)
    const pluralKebab = string.plural(normalized)
    const singularSnake = singularKebab.replace(/-/g, '_')

    return {
      raw,
      folder: singularKebab,
      singularPascal: string.pascalCase(singularKebab),
      pluralPascal: string.pascalCase(pluralKebab),
      singularSnake,
      singularKebab,
      pluralKebab,
    }
  }

  private ensureDir(dirPath: string) {
    mkdirSync(dirPath, { recursive: true })
  }

  private writeFile(filePath: string, content: string) {
    writeFileSync(filePath, content, 'utf8')
  }

  private writeFiles(basePath: string, names: IntegrationNames) {
    // contract
    this.writeFile(
      path.join(basePath, `${names.singularSnake}_contract.ts`),
      this.makeContractStub(names)
    )

    // implementation
    this.writeFile(
      path.join(basePath, `${names.singularSnake}.ts`),
      this.makeImplementationStub(names)
    )

    // config/options type
    this.writeFile(
      path.join(basePath, `${names.singularSnake}_options.ts`),
      this.makeOptionsStub(names)
    )

    // barrel
    this.writeFile(
      path.join(basePath, 'index.ts'),
      this.makeBarrelStub(names)
    )
  }

  private appendToIndex(names: IntegrationNames) {
    const indexPath = this.app.makePath('app/integrations/index.ts')
    const exportLine = `export * from './${names.folder}/index.js'\n`

    if (!existsSync(indexPath)) {
      this.writeFile(indexPath, `// Integrations registry\n${exportLine}`)
      return
    }

    const current = readFileSync(indexPath, 'utf8')
    if (current.includes(exportLine.trim())) {
      this.logger.info('Export already exists in app/integrations/index.ts')
      return
    }

    this.writeFile(indexPath, `${current}${exportLine}`)
  }

  private printDryRun(basePath: string, names: IntegrationNames) {
    this.logger.info(`[dry-run] Files that would be created for integration "${names.folder}":`)
    const files = [
      `${basePath}/${names.singularSnake}_contract.ts`,
      `${basePath}/${names.singularSnake}.ts`,
      `${basePath}/${names.singularSnake}_options.ts`,
      `${basePath}/index.ts`,
    ]
    for (const f of files) this.logger.log(`  + ${f}`)
    this.logger.info(`[dry-run] app/integrations/index.ts would receive export for "${names.folder}"`)
  }

  // ─── Stubs ─────────────────────────────────────────────────────────────────

  private makeContractStub(names: IntegrationNames) {
    return `/**
 * ${names.singularPascal} Contract
 *
 * Define the public interface that every ${names.singularPascal} implementation must satisfy.
 * Depend on this contract in your services — never on the concrete class.
 */
export interface ${names.singularPascal}Contract {
  /**
   * Initialize the integration (open connections, validate credentials, etc.)
   */
  connect(): Promise<void>

  /**
   * Gracefully disconnect / release resources.
   */
  disconnect(): Promise<void>

  // TODO: add domain-specific methods
  // Example: send(payload: unknown): Promise<void>
}
`
  }

  private makeImplementationStub(names: IntegrationNames) {
    return `import type { ${names.singularPascal}Contract } from './${names.singularSnake}_contract.js'
import type { ${names.singularPascal}Options } from './${names.singularSnake}_options.js'

/**
 * ${names.singularPascal}
 *
 * Concrete implementation of ${names.singularPascal}Contract.
 * Replace the stubs below with the actual integration logic.
 */
export class ${names.singularPascal} implements ${names.singularPascal}Contract {
  constructor(private readonly options: ${names.singularPascal}Options) {}

  async connect(): Promise<void> {
    // TODO: initialize SDK / open connection
    // Example: this.client = new ThirdPartySDK(this.options.apiKey)
  }

  async disconnect(): Promise<void> {
    // TODO: close connection / cleanup
  }

  // TODO: implement domain-specific methods
}
`
  }

  private makeOptionsStub(names: IntegrationNames) {
    return `/**
 * ${names.singularPascal}Options
 *
 * Configuration passed to the ${names.singularPascal} constructor.
 * Load values from Env or a config file — never hardcode credentials.
 *
 * Example:
 *   const integration = new ${names.singularPascal}({
 *     apiKey: env.get('${names.singularSnake.toUpperCase()}_API_KEY'),
 *   })
 */
export interface ${names.singularPascal}Options {
  apiKey: string
  // TODO: add integration-specific options
}
`
  }

  private makeBarrelStub(names: IntegrationNames) {
    return `export type { ${names.singularPascal}Contract } from './${names.singularSnake}_contract.js'
export type { ${names.singularPascal}Options } from './${names.singularSnake}_options.js'
export { ${names.singularPascal} } from './${names.singularSnake}.js'
`
  }
}