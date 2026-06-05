import router from '@adonisjs/core/services/router'

const UsersController = () => import('./controllers/users_controller.js')

router.group(() => {
  router.get('/users', [UsersController, 'index'])
  router.get('/users/:id', [UsersController, 'show'])
  router.post('/users', [UsersController, 'store'])
  router.put('/users/:id', [UsersController, 'update'])
  router.delete('/users/:id', [UsersController, 'destroy'])
  router.post('/login', [UsersController, 'login'])
}).prefix('/api/user')
