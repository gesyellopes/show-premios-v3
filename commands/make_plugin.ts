import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import string from '@adonisjs/core/helpers/string'
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

type PluginNames = {
  raw: string
  folder: string
  singularPascal: string
  singularSnake: string
  singularKebab: string
  eventPrefix: string
}

export default class MakePluginCommand extends BaseCommand {
  static commandName = 'make:plugin'
  static description = 'Create a plugin scaffold inside app/plugins'

  @args.string({
    description: 'Plugin name. Example: audit-log, slack-alerts, rate-limiter',
  })
  declare pluginName: string

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
    const names = this.makeNames(this.pluginName)
    const basePath = this.app.makePath(`app/plugins/${names.folder}`)

    if (existsSync(basePath) && !this.force) {
      this.logger.error(`Plugin "${names.folder}" already exists. Use --force to overwrite.`)
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

    this.logger.success(`Plugin "${names.folder}" created successfully`)
    this.logger.info(`Path: ${basePath}`)
  }

  private makeNames(raw: string): PluginNames {
    raw = raw.trim()

    if (!raw) throw new Error('You must provide a plugin name')
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(raw)) {
      throw new Error(`Invalid plugin name: "${raw}". Use only letters, numbers, hyphens and underscores.`)
    }

    const normalized = string.snakeCase(raw).replace(/_/g, '-')
    const singularKebab = string.singular(normalized)
    const singularSnake = singularKebab.replace(/-/g, '_')

    return {
      raw,
      folder: singularKebab,
      singularPascal: string.pascalCase(singularKebab),
      singularSnake,
      singularKebab,
      eventPrefix: singularSnake.toUpperCase(),
    }
  }

  private ensureDir(dirPath: string) {
    mkdirSync(dirPath, { recursive: true })
  }

  private writeFile(filePath: string, content: string) {
    writeFileSync(filePath, content, 'utf8')
  }

  private writeFiles(basePath: string, names: PluginNames) {
    // main plugin class
    this.writeFile(
      path.join(basePath, `${names.singularSnake}_plugin.ts`),
      this.makePluginStub(names)
    )

    // event listeners
    this.writeFile(
      path.join(basePath, `${names.singularSnake}_listeners.ts`),
      this.makeListenersStub(names)
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

  private appendToIndex(names: PluginNames) {
    const indexPath = this.app.makePath('app/plugins/index.ts')
    const exportLine = `export * from './${names.folder}/index.js'\n`

    if (!existsSync(indexPath)) {
      this.writeFile(indexPath, `// Plugins registry\n${exportLine}`)
      return
    }

    const current = readFileSync(indexPath, 'utf8')
    if (current.includes(exportLine.trim())) {
      this.logger.info('Export already exists in app/plugins/index.ts')
      return
    }

    this.writeFile(indexPath, `${current}${exportLine}`)
  }

  private printDryRun(basePath: string, names: PluginNames) {
    this.logger.info(`[dry-run] Files that would be created for plugin "${names.folder}":`)
    const files = [
      `${basePath}/${names.singularSnake}_plugin.ts`,
      `${basePath}/${names.singularSnake}_listeners.ts`,
      `${basePath}/${names.singularSnake}_options.ts`,
      `${basePath}/index.ts`,
    ]
    for (const f of files) this.logger.log(`  + ${f}`)
    this.logger.info(`[dry-run] app/plugins/index.ts would receive export for "${names.folder}"`)
  }

  // ─── Stubs ─────────────────────────────────────────────────────────────────

  private makePluginStub(names: PluginNames) {
    return `import type { ApplicationService } from '@adonisjs/core/types'
import type { ${names.singularPascal}Options } from './${names.singularSnake}_options.js'
import { ${names.singularPascal}Listeners } from './${names.singularSnake}_listeners.js'

/**
 * ${names.singularPascal}Plugin
 *
 * Lifecycle:
 *   setup()  → called once during app boot, before routes are loaded
 *
 * Use setup() to:
 *   - Register event listeners
 *   - Extend the app container
 *   - Add middleware globally
 *   - Bootstrap third-party SDKs that the plugin depends on
 */
export class ${names.singularPascal}Plugin {
  private listeners: ${names.singularPascal}Listeners

  constructor(
    private readonly app: ApplicationService,
    private readonly options: ${names.singularPascal}Options = {}
  ) {
    this.listeners = new ${names.singularPascal}Listeners(this.options)
  }

  async setup(): Promise<void> {
    // TODO: register event listeners
    // const emitter = await this.app.container.make('emitter')
    // emitter.on('user:created', this.listeners.onUserCreated.bind(this.listeners))

    // TODO: register any global middleware or bindings
  }

  async teardown(): Promise<void> {
    // TODO: cleanup — called on app shutdown
    // emitter.off(...)
  }
}
`
  }

  private makeListenersStub(names: PluginNames) {
    return `import type { ${names.singularPascal}Options } from './${names.singularSnake}_options.js'

/**
 * ${names.singularPascal}Listeners
 *
 * Contains all event handler methods for the ${names.singularPascal}Plugin.
 * Each method should be a single responsibility — one event, one action.
 *
 * Naming convention: on{EventName}
 *   emitter.on('user:created', listeners.onUserCreated.bind(listeners))
 */
export class ${names.singularPascal}Listeners {
  constructor(private readonly options: ${names.singularPascal}Options) {}

  // TODO: add event handlers
  // Example:
  // async onUserCreated(user: User): Promise<void> {
  //   // handle user:created event
  // }
}
`
  }

  private makeOptionsStub(names: PluginNames) {
    return `/**
 * ${names.singularPascal}Options
 *
 * Configuration passed when registering the plugin.
 * All fields should be optional so the plugin works with zero config
 * and can be tuned when needed.
 *
 * Example:
 *   new ${names.singularPascal}Plugin(app, {
 *     enabled: true,
 *     // ...
 *   })
 */
export interface ${names.singularPascal}Options {
  /**
   * Whether the plugin is active. Defaults to true.
   */
  enabled?: boolean

  // TODO: add plugin-specific options
}
`
  }

  private makeBarrelStub(names: PluginNames) {
    return `export type { ${names.singularPascal}Options } from './${names.singularSnake}_options.js'
export { ${names.singularPascal}Listeners } from './${names.singularSnake}_listeners.js'
export { ${names.singularPascal}Plugin } from './${names.singularSnake}_plugin.js'
`
  }
}