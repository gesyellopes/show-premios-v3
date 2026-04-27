import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import string from '@adonisjs/core/helpers/string'
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

type ModuleNames = {
  raw: string
  folder: string
  singular: string
  plural: string
  singularPascal: string
  pluralPascal: string
  singularCamel: string
  pluralCamel: string
  singularSnake: string
  pluralSnake: string
  singularKebab: string
  pluralKebab: string
  routePath: string
}

export default class MakeModuleCommand extends BaseCommand {
  static commandName = 'make:module'
  static description = 'Create a professional module scaffold inside app/modules'

  @args.string({
    description: 'Module name. Example: notifications, users, chat',
  })
  declare moduleName: string

  @flags.boolean({
    description: 'Generate API REST boilerplate routes/controller methods',
    default: false,
  })
  declare api: boolean

  @flags.boolean({
    description: 'Generate provider boilerplate',
    default: false,
  })
  declare withProvider: boolean

  @flags.boolean({
    description: 'Generate policy boilerplate',
    default: false,
  })
  declare withPolicy: boolean

  @flags.boolean({
    description: 'Generate migration file for this module',
    default: false,
  })
  declare withMigration: boolean

  @flags.boolean({
    description: 'Shorthand for --api --with-provider --with-policy --with-migration',
    default: false,
  })
  declare all: boolean

  @flags.boolean({
    description: 'Print what would be created without writing anything to disk',
    default: false,
  })
  declare dryRun: boolean

  async run() {
    // Resolve --all before anything else
    if (this.all) {
      this.api = true
      this.withProvider = true
      this.withPolicy = true
      this.withMigration = true
    }

    // --- NOVA PARTE: PERGUNTAS AO USUÁRIO ---
    const moduleIsPlural = await this.prompt.choice(
      'Module folder/name plural (P) ou singular (S)?',
      [
        { name: 'plural', message: 'Plural' },
        { name: 'singular', message: 'Singular' },
      ]
    )

    const routesArePlural = await this.prompt.choice('Routes name plural (P) ou singular (S)?', [
      { name: 'plural', message: 'Plural' },
      { name: 'singular', message: 'Singular' },
    ])
    // ----------------------------------------

    // Passe essas escolhas para o makeNames
    const names = this.makeNames(
      this.moduleName,
      moduleIsPlural === 'plural',
      routesArePlural === 'plural'
    )

    const moduleBasePath = this.app.makePath(`app/modules/${names.folder}`)

    if (existsSync(moduleBasePath)) {
      this.logger.error(`Module "${names.folder}" already exists`)
      this.exitCode = 1
      return
    }

    if (this.dryRun) {
      this.printDryRun(moduleBasePath, names)
      return
    }

    this.ensureDir(moduleBasePath)

    this.makeDirectories(moduleBasePath, {
      withProvider: this.withProvider,
      withPolicy: this.withPolicy,
    })

    this.writeModuleFiles(moduleBasePath, names, {
      api: this.api,
      withProvider: this.withProvider,
      withPolicy: this.withPolicy,
      withMigration: this.withMigration,
    })

    this.appendRouteImport(names)

    this.logger.success(`Module "${names.folder}" created successfully`)
    this.logger.info(`Path: ${moduleBasePath}`)
  }

  private makeNames(moduleName: string, modulePlural: boolean, routesPlural: boolean): ModuleNames {
    const raw = moduleName.trim()

    if (!raw) {
      throw new Error('You must provide a module name')
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(raw)) {
      throw new Error(
        `Invalid module name: "${raw}". Use only letters, numbers, hyphens and underscores.`
      )
    }

    const normalized = string.snakeCase(raw).replace(/_/g, '-')

    const singularKebab = string.singular(normalized)
    const pluralKebab = string.plural(normalized)

    // Define o nome da pasta baseado na escolha do usuário
    const folderName = modulePlural ? pluralKebab : singularKebab

    // Define o prefixo da rota baseado na escolha do usuário
    const routePath = routesPlural ? pluralKebab : singularKebab

    const singularSnake = singularKebab.replace(/-/g, '_')
    const pluralSnake = pluralKebab.replace(/-/g, '_')

    return {
      raw,
      folder: folderName, // <--- Aqui muda a pasta
      routePath: routePath, // <--- Novo campo para a rota
      singular: singularKebab,
      plural: pluralKebab,
      singularPascal: string.pascalCase(singularKebab),
      pluralPascal: string.pascalCase(pluralKebab),
      singularCamel: string.camelCase(singularKebab),
      pluralCamel: string.camelCase(pluralKebab),
      singularSnake,
      pluralSnake,
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

  private makeDirectories(
    moduleBasePath: string,
    options: { withProvider: boolean; withPolicy: boolean }
  ) {
    // Only create empty dirs (that won't receive generated files) with .gitkeep
    const emptyDirs = ['dtos', 'types']

    if (options.withPolicy) emptyDirs.push('policies')
    if (options.withProvider) emptyDirs.push('providers')

    for (const dir of emptyDirs) {
      const fullPath = path.join(moduleBasePath, dir)
      this.ensureDir(fullPath)
      this.writeFile(path.join(fullPath, '.gitkeep'), '')
    }

    // Non-empty dirs: just ensure they exist, no .gitkeep needed
    for (const dir of ['controllers', 'services', 'models', 'validators']) {
      this.ensureDir(path.join(moduleBasePath, dir))
    }
  }

  private writeModuleFiles(
    moduleBasePath: string,
    names: ModuleNames,
    options: {
      api: boolean
      withProvider: boolean
      withPolicy: boolean
      withMigration: boolean
    }
  ) {
    this.writeFile(path.join(moduleBasePath, 'routes.ts'), this.makeRoutesStub(names, options))

    this.writeFile(path.join(moduleBasePath, 'index.ts'), this.makeModuleIndexStub(names, options))

    this.writeFile(
      path.join(moduleBasePath, 'controllers', `${names.pluralSnake}_controller.ts`),
      this.makeControllerStub(names, options)
    )

    this.writeFile(
      path.join(moduleBasePath, 'services', `${names.singularSnake}_service.ts`),
      this.makeServiceStub(names)
    )

    this.writeFile(
      path.join(moduleBasePath, 'models', `${names.singularSnake}.ts`),
      this.makeModelStub(names)
    )

    this.writeFile(
      path.join(moduleBasePath, 'validators', `create_${names.singularSnake}_validator.ts`),
      this.makeCreateValidatorStub(names)
    )

    this.writeFile(
      path.join(moduleBasePath, 'validators', `update_${names.singularSnake}_validator.ts`),
      this.makeUpdateValidatorStub(names)
    )

    this.writeFile(
      path.join(moduleBasePath, 'dtos', `${names.singularSnake}_dto.ts`),
      this.makeDtoStub(names)
    )

    this.writeFile(
      path.join(moduleBasePath, 'types', `${names.singularSnake}.ts`),
      this.makeTypeStub(names)
    )

    this.writeFile(
      path.join(moduleBasePath, 'types', 'index.ts'),
      `export * from './${names.singularSnake}.js'\n`
    )

    if (options.withPolicy) {
      this.writeFile(
        path.join(moduleBasePath, 'policies', `${names.singularSnake}_policy.ts`),
        this.makePolicyStub(names)
      )
    }

    if (options.withProvider) {
      this.writeFile(
        path.join(moduleBasePath, 'providers', `${names.pluralSnake}_provider.ts`),
        this.makeProviderStub(names)
      )
    }

    if (options.withMigration) {
      const timestamp = new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, '')
        .slice(0, 14)
      const migrationsPath = this.app.makePath('database/migrations')
      this.ensureDir(migrationsPath)
      this.writeFile(
        path.join(migrationsPath, `${timestamp}_create_${names.pluralSnake}_table.ts`),
        this.makeMigrationStub(names)
      )
    }
  }

  private appendRouteImport(names: ModuleNames) {
    const routesFilePath = this.app.makePath('start/routes.ts')
    const importLine = `import '#modules/${names.folder}/routes.js'\n`
    const anchor = "import router from '@adonisjs/core/services/router'"

    if (!existsSync(routesFilePath)) {
      this.writeFile(routesFilePath, `${anchor}\n\n${importLine}`)
      return
    }

    const currentContent = readFileSync(routesFilePath, 'utf8')

    // Evita duplicados
    if (currentContent.includes(importLine.trim())) {
      this.logger.info(`Route import already exists in start/routes.ts`)
      return
    }

    // Se o arquivo contiver o anchor, insere logo abaixo
    if (currentContent.includes(anchor)) {
      const newContent = currentContent.replace(anchor, `${anchor}\n${importLine}`)
      this.writeFile(routesFilePath, newContent)
    } else {
      // Caso não ache o anchor (por segurança), coloca no topo como antes
      const newContent = `${importLine}${currentContent}`
      this.writeFile(routesFilePath, newContent)
    }
  }

  private printDryRun(moduleBasePath: string, names: ModuleNames) {
    const files = [
      `${moduleBasePath}/routes.ts`,
      `${moduleBasePath}/index.ts`,
      `${moduleBasePath}/controllers/${names.pluralSnake}_controller.ts`,
      `${moduleBasePath}/services/${names.singularSnake}_service.ts`,
      `${moduleBasePath}/models/${names.singularSnake}.ts`,
      `${moduleBasePath}/validators/create_${names.singularSnake}_validator.ts`,
      `${moduleBasePath}/validators/update_${names.singularSnake}_validator.ts`,
      `${moduleBasePath}/dtos/${names.singularSnake}_dto.ts`,
      `${moduleBasePath}/types/${names.singularSnake}.ts`,
      `${moduleBasePath}/types/index.ts`,
    ]

    if (this.withPolicy) {
      files.push(`${moduleBasePath}/policies/${names.singularSnake}_policy.ts`)
    }

    if (this.withProvider) {
      files.push(`${moduleBasePath}/providers/${names.pluralSnake}_provider.ts`)
    }

    if (this.withMigration) {
      const timestamp = new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, '')
        .slice(0, 14)
      files.push(`database/migrations/${timestamp}_create_${names.pluralSnake}_table.ts`)
    }

    this.logger.info(`[dry-run] Files that would be created for module "${names.folder}":`)
    for (const file of files) {
      this.logger.log(`  + ${file}`)
    }
    this.logger.info(
      `[dry-run] start/routes.ts would receive: import '#modules/${names.folder}/routes'`
    )
  }

  // ─── Stubs ─────────────────────────────────────────────────────────────────

  private makeRoutesStub(names: ModuleNames, options: { api: boolean; withPolicy: boolean }) {
    const controllerImport = `const ${names.pluralPascal}Controller = () => import('./controllers/${names.pluralSnake}_controller.js')`

    if (!options.api) {
      return `import router from '@adonisjs/core/services/router'

${controllerImport}

router.group(() => {
  router.get('/${names.pluralKebab}', [${names.pluralPascal}Controller, 'index'])
}).prefix('/api/${names.routePath}')
`
    }

    const maybePolicyComment = options.withPolicy
      ? `  // Example: .use(middleware.policy([${names.singularPascal}Policy, 'viewAny']))\n`
      : ''

    return `import router from '@adonisjs/core/services/router'

const ${names.pluralPascal}Controller = () => import('./controllers/${names.pluralSnake}_controller.js')

router
  .group(() => {
${maybePolicyComment}    router.get('/', [${names.pluralPascal}Controller, 'index'])
    router.get('/:id', [${names.pluralPascal}Controller, 'show'])
    router.post('/', [${names.pluralPascal}Controller, 'store'])
    router.put('/:id', [${names.pluralPascal}Controller, 'update'])
    router.delete('/:id', [${names.pluralPascal}Controller, 'destroy'])
  })
  .prefix('/api/${names.routePath}')
`
  }

  //removido router.patch('/:id', [${names.pluralPascal}Controller, 'update']) estava dando erro

  private makeModuleIndexStub(
    names: ModuleNames,
    options: { withProvider: boolean; withPolicy: boolean }
  ) {
    const exports = [
      `export * from './types/index.js'`,
      `export { default as ${names.pluralPascal}Controller } from './controllers/${names.pluralSnake}_controller.js'`,
      `export { default as ${names.singularPascal}Service } from './services/${names.singularSnake}_service.js'`,
      `export { default as ${names.singularPascal} } from './models/${names.singularSnake}.js'`,
    ]

    if (options.withPolicy) {
      exports.push(
        `export { default as ${names.singularPascal}Policy } from './policies/${names.singularSnake}_policy.js'`
      )
    }

    if (options.withProvider) {
      exports.push(
        `export { default as ${names.pluralPascal}Provider } from './providers/${names.pluralSnake}_provider.js'`
      )
    }

    return `${exports.join('\n')}\n`
  }

  private makeControllerStub(
    names: ModuleNames,
    options: { api: boolean; withProvider: boolean; withPolicy: boolean }
  ) {
    if (!options.api) {
      return `import type { HttpContext } from '@adonisjs/core/http'

export default class ${names.pluralPascal}Controller {
  async index({ response }: HttpContext) {
    return response.ok({
      module: '${names.folder}',
      action: 'index',
    })
  }
}
`
    }

    return `import type { HttpContext } from '@adonisjs/core/http'
import ${names.singularPascal}Service from '../services/${names.singularSnake}_service.js'

export default class ${names.pluralPascal}Controller {
  async index({ response }: HttpContext) {
    const service = new ${names.singularPascal}Service()

    return response.ok({
      data: await service.list(),
    })
  }

  async show({ params, response }: HttpContext) {
    const service = new ${names.singularPascal}Service()

    return response.ok({
      data: await service.find(params.id),
    })
  }

  async store({ request, response }: HttpContext) {
    const service = new ${names.singularPascal}Service()
    const payload = request.all()

    return response.created({
      data: await service.create(payload),
    })
  }

  async update({ params, request, response }: HttpContext) {
    const service = new ${names.singularPascal}Service()
    const payload = request.all()

    return response.ok({
      data: await service.update(params.id, payload),
    })
  }

  async destroy({ params, response }: HttpContext) {
    const service = new ${names.singularPascal}Service()

    await service.delete(params.id)

    return response.ok({
      success: true,
    })
  }
}
`
  }

  private makeServiceStub(names: ModuleNames) {
    return `export default class ${names.singularPascal}Service {
  async list() {
    return []
  }

  async find(id: number | string) {
    return {
      id,
    }
  }

  async create(payload: Record<string, unknown>) {
    return {
      ...payload,
    }
  }

  async update(id: number | string, payload: Record<string, unknown>) {
    return {
      id,
      ...payload,
    }
  }

  async delete(id: number | string) {
    return {
      id,
      deleted: true,
    }
  }
}
`
  }

  private makeModelStub(names: ModuleNames) {
    return `import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ${names.singularPascal} extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
`
  }

  private makeCreateValidatorStub(names: ModuleNames) {
    return `export const create${names.singularPascal}Validator = {
  //
}
`
  }

  private makeUpdateValidatorStub(names: ModuleNames) {
    return `export const update${names.singularPascal}Validator = {
  //
}
`
  }

  private makeDtoStub(names: ModuleNames) {
    return `export interface ${names.singularPascal}Dto {
  id?: number
}
`
  }

  private makeTypeStub(names: ModuleNames) {
    return `export interface ${names.singularPascal}Payload {
  id?: number
}
`
  }

  private makePolicyStub(names: ModuleNames) {
    return `export default class ${names.singularPascal}Policy {
  async viewAny() {
    return true
  }

  async view() {
    return true
  }

  async create() {
    return true
  }

  async update() {
    return true
  }

  async delete() {
    return true
  }
}
`
  }

  private makeProviderStub(names: ModuleNames) {
    return `import type { ApplicationService } from '@adonisjs/core/types'

export default class ${names.pluralPascal}Provider {
  constructor(protected app: ApplicationService) {}

  register() {
    //
  }

  async boot() {
    //
  }

  async start() {
    //
  }

  async ready() {
    //
  }

  async shutdown() {
    //
  }
}
`
  }

  private makeMigrationStub(names: ModuleNames) {
    return `import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = '${names.pluralSnake}'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
`
  }
}
