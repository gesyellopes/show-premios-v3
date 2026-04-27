import router from '@adonisjs/core/services/router'

const AuthsController = () => import('./controllers/auths_controller.js')

router
  .group(() => {
    // Example: .use(middleware.policy([AuthPolicy, 'viewAny']))
    router.get('/', [AuthsController, 'index'])
    router.get('/:id', [AuthsController, 'show'])
    router.post('/', [AuthsController, 'store'])
    router.put('/:id', [AuthsController, 'update'])
    router.delete('/:id', [AuthsController, 'destroy'])
  })
  .prefix('/api/auths')
