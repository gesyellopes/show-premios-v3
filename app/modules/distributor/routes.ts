import router from '@adonisjs/core/services/router'

const DistributorsController = () => import('./controllers/distributors_controller.js')

router.group(() => {
  router.get('/', [DistributorsController, 'index'])
  router.post('/', [DistributorsController, 'store'])
}).prefix('/api/events/:eventId/distributors')
