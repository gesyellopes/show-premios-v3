import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class AddValidatedOnColumn extends BaseCommand {
  static commandName = 'add:validated-on'
  static description = 'Adiciona coluna validated_on às tabelas auxiliares'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('⏳ Adicionando coluna validated_on às tabelas auxiliares...')

    try {
      await db.rawQuery(`
        ALTER TABLE tickets_pirapora
        ADD COLUMN validated_on DATETIME NULL AFTER validated
      `)
      this.logger.success('✅ Coluna validated_on adicionada em tickets_pirapora')

      await db.rawQuery(`
        ALTER TABLE tickets_buritizeiro
        ADD COLUMN validated_on DATETIME NULL AFTER validated
      `)
      this.logger.success('✅ Coluna validated_on adicionada em tickets_buritizeiro')

      this.logger.info('✅ Processo concluído!')
    } catch (error: any) {
      if (error.message.includes('Duplicate column')) {
        this.logger.warning('⚠️  A coluna validated_on já existe nas tabelas')
        return
      }
      const msg = error instanceof Error ? error.message : 'Erro desconhecido'
      this.logger.error(`❌ Erro ao adicionar coluna: ${msg}`)
      throw error
    }
  }
}
