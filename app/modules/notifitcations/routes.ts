import router from '@adonisjs/core/services/router'

const NotifitcationsController = () => import('./controllers/notifitcations_controller.js')

router
  .group(() => {
  // Example: .use(middleware.policy([NotifitcationPolicy, 'viewAny']))
    router.get('/', [NotifitcationsController, 'index'])
    router.get('/:id', [NotifitcationsController, 'show'])
    router.post('/', [NotifitcationsController, 'store'])
    router.put('/:id', [NotifitcationsController, 'update'])
    router.delete('/:id', [NotifitcationsController, 'destroy'])
  })
  .prefix('/api/notifitcations')
