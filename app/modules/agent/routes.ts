import router from '@adonisjs/core/services/router'

const AgentsController = () => import('./controllers/agents_controller.js')

router.group(() => {
  router.get('/agents', [AgentsController, 'index'])
  router.post('/agents', [AgentsController, 'store'])
  router.get('/agents/:id', [AgentsController, 'show'])
  router.put('/agents/:id', [AgentsController, 'update'])
  router.delete('/agents/:id', [AgentsController, 'destroy'])
}).prefix('/api/agent')
