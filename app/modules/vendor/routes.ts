import router from '@adonisjs/core/services/router'

const VendorsController = () => import('./controllers/vendors_controller.js')

router.group(() => {
  router.get('/', [VendorsController, 'index'])
  router.post('/', [VendorsController, 'store'])
}).prefix('/api/events/:eventId/vendors')
