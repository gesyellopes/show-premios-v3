import router from '@adonisjs/core/services/router'

const TicketsController = () => import('./controllers/tickets_controller.js')

router
  .group(() => {
    router.get('/', [TicketsController, 'index'])
    router.post('/webhook', [TicketsController, 'webhook'])
    router.get('/get-file', [TicketsController, 'getFile'])
    //Teste para processamento de imagem
    router.get('/execute/:fileId', [TicketsController, 'messageExecute'])

    router.post('/bulk', [TicketsController, 'bulkCreate'])
    router.post('/bulk-update', [TicketsController, 'bulkUpdate'])
    router.post('/queue', [TicketsController, 'manageQueue'])

    //Validação de ticket
    router.get('/validate/:ticketNumber', [TicketsController, 'verifyTicket'])
  })
  .prefix('/api/tickets')
