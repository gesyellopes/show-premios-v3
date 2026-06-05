import router from '@adonisjs/core/services/router'

const DealersController = () => import('./controllers/dealers_controller.js')

router.group(() => {
  router.get('/dealers', [DealersController, 'index'])
  router.post('/dealers', [DealersController, 'store'])
  router.get('/dealers/:id', [DealersController, 'show'])
  router.patch('/dealers/:id', [DealersController, 'update'])
  router.delete('/dealers/:id', [DealersController, 'destroy'])
}).prefix('/api/dealer')
