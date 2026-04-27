import router from '@adonisjs/core/services/router'

const HealthController = () => import('./controllers/health_controller.js')

router
  .group(() => {
  // Example: .use(middleware.policy([HealthPolicy, 'viewAny']))
    router.get('/live', [HealthController, 'live'])
    router.get('/ready', [HealthController, 'ready'])
  })
  .prefix('/api/health')
