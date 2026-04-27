import router from '@adonisjs/core/services/router'

const TenantsController = () => import('./controllers/tenants_controller.js')

router
  .group(() => {
  // Example: .use(middleware.policy([TenantPolicy, 'viewAny']))
    router.get('/', [TenantsController, 'index'])
    router.get('/:id', [TenantsController, 'show'])
    router.post('/', [TenantsController, 'store'])
    router.put('/:id', [TenantsController, 'update'])
    router.delete('/:id', [TenantsController, 'destroy'])
  })
  .prefix('/api/tenant')
