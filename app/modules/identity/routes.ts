import router from '@adonisjs/core/services/router'
const IdentitiesController = () => import('./controllers/identities_controller.js')

router
  .group(() => {
    router.post('/public-register', [IdentitiesController, 'publicRegister']) // Rota de registro público
    router.post('/register', [IdentitiesController, 'store'])
    router.get('/:id', [IdentitiesController, 'show']) // :id será o UUID
  })
  .prefix('/api/identity')
