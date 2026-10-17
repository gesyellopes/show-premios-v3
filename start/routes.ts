/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import '#modules/ticket/routes.js'

const RedisController = () => import('#controllers/redis_controller')

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    // Simula a chegada do Webhook
    router.post('/webhook', [RedisController, 'simulateWebhook'])

    // Lista todas as chaves "message:*"
    router.get('/queue', [RedisController, 'index'])

    // Deleta uma chave específica (passe ?key=message:uuid na URL)
    router.delete('/queue', [RedisController, 'destroy'])
  })
  .prefix('/api')
