//import '#modules/notifications/routes'
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

//import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

import '#modules/ticket/routes.js'

import '#modules/tenant/routes.js'

import '#modules/auth/routes.js'

import '#modules/identity/routes.js'

import '#modules/notifitcations/routes.js'
import '#modules/health/routes.js'

const RedisController = () => import('#controllers/redis_controller')

//import { controllers } from '#generated/controllers'

const PersonsController = () => import('#controllers/persons_controller')
const UsersController = () => import('#controllers/users_controller')

const SettingsController = () => import('#controllers/settings_controller')

router.get('/persons', [PersonsController, 'index'])
router.get('/persons/:id', [PersonsController, 'show'])
router.post('/persons', [PersonsController, 'store'])
router.put('/persons/:id', [PersonsController, 'update'])
router.delete('/persons/:id', [PersonsController, 'destroy'])

router.get('/users', [UsersController, 'index'])
router.get('/users/:id', [UsersController, 'show'])
router.post('/users', [UsersController, 'store'])
router.put('/users/:id', [UsersController, 'update'])
router.delete('/users/:id', [UsersController, 'destroy'])

router.get('/', () => {
  return { hello: 'world' }
})

router.get('/settings', [SettingsController, 'index'])
router.get('/settings/:key', [SettingsController, 'show'])
router.post('/settings', [SettingsController, 'store'])
router.put('/settings/:key', [SettingsController, 'update'])
router.delete('/settings/:key', [SettingsController, 'destroy'])
router.post('/settings/refresh', [SettingsController, 'refresh'])

router.post('/settings/bulk-patch', [SettingsController, 'bulkPatch']) // patch parcial em lote
router.post('/settings/bulk-upsert', [SettingsController, 'bulkUpsert'])
router.post('/settings/bulk-delete', [SettingsController, 'bulkDelete'])

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

/*
router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
        router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
*/
