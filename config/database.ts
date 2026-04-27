import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  /**
   * Conexão padrão
   */
  connection: 'mysql',

  connections: {
    /**
     * MySQL / MariaDB
     */
    mysql: {
      client: 'mysql2',

      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT') ? Number(env.get('DB_PORT')) : undefined,
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },

      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },

      /**
       * Só loga queries em dev
       */
      debug: app.inDev,
    },
  },
})

export default dbConfig
