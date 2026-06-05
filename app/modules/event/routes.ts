import router from '@adonisjs/core/services/router'

const EventsController = () => import('./controllers/events_controller.js')

router.group(() => {
  router.get('/events', [EventsController, 'index'])
  router.post('/events', [EventsController, 'store'])
  router.get('/events/:id', [EventsController, 'show'])
  router.patch('/events/:id', [EventsController, 'update'])
  router.delete('/events/:id', [EventsController, 'destroy'])
}).prefix('/api/event')
