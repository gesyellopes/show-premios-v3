# Documentação do Módulo Dealer

Bem-vindo à documentação do módulo de Dealers! Este módulo fornece um CRUD completo para gerenciar dealers (revendedores) associados a eventos.

## 📋 Documentos Disponíveis

### 1. [CRUD.md](./CRUD.md)
Documentação técnica completa do CRUD incluindo:
- Estrutura de dados
- Descrição de todos os endpoints
- Exemplos de requisições e respostas
- Validações
- Notas importantes

### 2. [POSTMAN_SETUP.md](./POSTMAN_SETUP.md)
Guia passo a passo para:
- Importar a coleção Postman
- Configurar variáveis de ambiente
- Usar scripts de pré-requisição
- Solução de problemas comuns

### 3. [dealers_postman_collection.json](./dealers_postman_collection.json)
Arquivo de exportação da coleção Postman com todas as requisições prontas para usar.

## 🚀 Quick Start

### 1. Entender a Estrutura
Um dealer contém:
- `id`: Identificador único
- `uuid`: Identificador universal
- `eventId`: ID do evento associado
- `name`: Nome do dealer
- `userId`: ID do usuário responsável
- `user`: Objeto com dados do responsável (carregado automaticamente)

### 2. Endpoints Disponíveis

```
GET    /api/dealer/dealers        → Listar todos
GET    /api/dealer/dealers/:id    → Obter um específico
POST   /api/dealer/dealers        → Criar novo
PATCH  /api/dealer/dealers/:id    → Atualizar
DELETE /api/dealer/dealers/:id    → Deletar
```

### 3. Exemplo: Criar um Dealer

```bash
curl -X POST http://localhost:3333/api/dealer/dealers \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": 1,
    "name": "Dealer ABC",
    "userId": 5
  }'
```

### 4. Resposta Esperada

```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "eventId": 1,
  "name": "Dealer ABC",
  "userId": 5,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "user": {
    "id": 5,
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

## 📁 Estrutura do Módulo

```
dealer/
├── controllers/
│   └── dealers_controller.ts    # Controller com ações CRUD
├── models/
│   └── dealer.ts               # Modelo Dealer com relação com User
├── services/
│   └── dealer_service.ts       # Lógica de negócio
├── validators/
│   ├── create_dealer_validator.ts
│   └── update_dealer_validator.ts
├── types/
│   └── dealer.ts               # Interfaces TypeScript
├── dtos/
│   └── dealer_dto.ts           # DTOs
├── docs/                        # 📍 Você está aqui
│   ├── README.md
│   ├── CRUD.md
│   ├── POSTMAN_SETUP.md
│   └── dealers_postman_collection.json
└── routes.ts                    # Definição de rotas
```

## 🔗 Relacionamentos

### Dealer → User (Muitos para Um)
- Um dealer está associado a um usuário (responsável)
- Quando você lista/visualiza dealers, o responsável é carregado automaticamente
- O usuário não pode ser deletado enquanto houver dealers associados (FK com CASCADE)

### Dealer → Event (Muitos para Um)
- Um dealer está associado a um evento
- O evento não pode ser deletado enquanto houver dealers associados (FK com CASCADE)

## ✅ Validações

### Criar Dealer
- `eventId`: Número positivo (obrigatório)
- `name`: String 3-255 caracteres (obrigatório)
- `userId`: Número positivo (obrigatório)

### Atualizar Dealer
- Todos os campos são opcionais
- Mesmas validações que criar quando enviados

## 🛠️ Como Testar

### Via Postman
1. Importe a coleção: `dealers_postman_collection.json`
2. Configure a variável `base_url` para `http://localhost:3333`
3. Execute as requisições na ordem desejada

### Via cURL
Use os exemplos fornecidos em [CRUD.md](./CRUD.md)

### Via Código
```typescript
import DealerService from '#app/modules/dealer/services/dealer_service'

const service = new DealerService()

// Listar
const dealers = await service.list()

// Criar
const newDealer = await service.create({
  eventId: 1,
  name: 'Novo Dealer',
  userId: 5
})

// Atualizar
const updated = await service.update(1, { name: 'Dealer Atualizado' })

// Deletar
await service.delete(1)
```

## ⚠️ Erros Comuns

| Erro | Causa | Solução |
|------|-------|--------|
| 404 | Dealer não encontrado | Verifique o ID ou UUID |
| 422 | Validação falhou | Confira os campos obrigatórios e formatos |
| 500 | Erro de servidor | Verifique se o `eventId` e `userId` existem |

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte [CRUD.md](./CRUD.md) para detalhes técnicos
2. Consulte [POSTMAN_SETUP.md](./POSTMAN_SETUP.md) para problemas com Postman
3. Verifique os logs do servidor para erros de backend

---

**Última atualização:** 2024-01-15
