import router from '@adonisjs/core/services/router'

const PeopleController = () => import('./controllers/people_controller.js')

router.group(() => {
  router.get('/people', [PeopleController, 'index'])
}).prefix('/api/person')
