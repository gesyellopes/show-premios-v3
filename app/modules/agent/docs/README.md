# Documentação - CRUD de Agents

## Visão Geral

Este documento descreve como utilizar o sistema de gerenciamento de Agents (Agentes) da aplicação. Um Agent é uma entidade que representa um agente no sistema, possuindo um UUID único, um evento associado, um nome e um ID do responsável (user_id).

## Estrutura de Dados

### Agent

Um agent possui os seguintes campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `number` | ID único (auto-incrementado) |
| `uuid` | `string` | UUID único gerado automaticamente |
| `eventId` | `number` | ID do evento associado (obrigatório) |
| `name` | `string` | Nome do agent (obrigatório) |
| `userId` | `number` | ID do usuário responsável (obrigatório) |
| `createdAt` | `datetime` | Data de criação (automática) |
| `updatedAt` | `datetime` | Data da última atualização (automática) |
| `user` | `object` | Objeto do usuário responsável (opcional, trazido em listagens) |
| `event` | `object` | Objeto do evento associado (opcional, trazido em listagens) |

## Endpoints

### Listar Todos os Agents

**Endpoint:** `GET /api/agent/agents`

**Descrição:** Retorna uma lista de todos os agents cadastrados com informações do usuário responsável.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "eventId": 1,
      "name": "Agent 1",
      "userId": 1,
      "createdAt": "2026-06-04T10:30:00.000Z",
      "updatedAt": "2026-06-04T10:30:00.000Z",
      "user": {
        "id": 1,
        "name": "João Silva",
        "email": "joao@example.com"
      },
      "event": {
        "id": 1,
        "name": "Evento 1"
      }
    }
  ]
}
```

### Visualizar um Agent Específico

**Endpoint:** `GET /api/agent/agents/:id`

**Descrição:** Retorna as informações de um agent específico. O parâmetro `:id` pode ser o ID numérico ou o UUID do agent.

**Parâmetros:**
- `id` (path parameter): ID ou UUID do agent

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "eventId": 1,
    "name": "Agent 1",
    "userId": 1,
    "createdAt": "2026-06-04T10:30:00.000Z",
    "updatedAt": "2026-06-04T10:30:00.000Z",
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "event": {
      "id": 1,
      "name": "Evento 1"
    }
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Agent não encontrado"
}
```

### Criar um Novo Agent

**Endpoint:** `POST /api/agent/agents`

**Descrição:** Cria um novo agent no sistema. O UUID é gerado automaticamente.

**Request Body:**
```json
{
  "eventId": 1,
  "name": "Agent 2",
  "userId": 1
}
```

**Validações:**
- `eventId`: obrigatório, número inteiro positivo
- `name`: obrigatório, string com mínimo 3 e máximo 255 caracteres
- `userId`: obrigatório, número inteiro positivo

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "uuid": "660e8400-e29b-41d4-a716-446655440001",
    "eventId": 1,
    "name": "Agent 2",
    "userId": 1,
    "createdAt": "2026-06-04T10:35:00.000Z",
    "updatedAt": "2026-06-04T10:35:00.000Z"
  },
  "message": "Agent criado com sucesso"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Erro ao criar agent",
  "error": "Detalhes do erro de validação"
}
```

### Atualizar um Agent

**Endpoint:** `PUT /api/agent/agents/:id`

**Descrição:** Atualiza as informações de um agent existente. Os campos `name` e `userId` são opcionais.

**Parâmetros:**
- `id` (path parameter): ID ou UUID do agent

**Request Body:**
```json
{
  "eventId": 2,
  "name": "Agent 2 Atualizado",
  "userId": 2
}
```

**Validações:**
- `eventId`: opcional, número inteiro positivo
- `name`: opcional, string com mínimo 3 e máximo 255 caracteres
- `userId`: opcional, número inteiro positivo

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "uuid": "660e8400-e29b-41d4-a716-446655440001",
    "eventId": 2,
    "name": "Agent 2 Atualizado",
    "userId": 2,
    "createdAt": "2026-06-04T10:35:00.000Z",
    "updatedAt": "2026-06-04T10:40:00.000Z",
    "user": {
      "id": 2,
      "name": "Maria Santos",
      "email": "maria@example.com"
    },
    "event": {
      "id": 2,
      "name": "Evento 2"
    }
  },
  "message": "Agent atualizado com sucesso"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Erro ao atualizar agent",
  "error": "Detalhes do erro"
}
```

### Deletar um Agent

**Endpoint:** `DELETE /api/agent/agents/:id`

**Descrição:** Deleta um agent do sistema.

**Parâmetros:**
- `id` (path parameter): ID ou UUID do agent

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "uuid": "660e8400-e29b-41d4-a716-446655440001",
    "eventId": 2,
    "deleted": true
  },
  "message": "Agent deletado com sucesso"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Erro ao deletar agent",
  "error": "Detalhes do erro"
}
```

## Exemplos de Uso

### Criar um Agent

```bash
curl -X POST http://localhost:3333/api/agent/agents \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": 1,
    "name": "Agent de Vendas",
    "userId": 1
  }'
```

### Listar Todos os Agents

```bash
curl -X GET http://localhost:3333/api/agent/agents
```

### Visualizar um Agent Específico

```bash
curl -X GET http://localhost:3333/api/agent/agents/1
```

### Atualizar um Agent

```bash
curl -X PUT http://localhost:3333/api/agent/agents/1 \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": 2,
    "name": "Agent de Vendas Premium"
  }'
```

### Deletar um Agent

```bash
curl -X DELETE http://localhost:3333/api/agent/agents/1
```

## Notas Importantes

- O UUID é gerado automaticamente quando um agent é criado
- O agent está vinculado a um evento através do `eventId` (obrigatório)
- O agent herda a relação com o usuário responsável através do `userId`
- As datas de criação e atualização são gerenciadas automaticamente pelo sistema
- Ao deletar um agent, a operação é em cascata devido à constraint de chave estrangeira
- A busca por ID ou UUID é suportada em todos os endpoints que recebem um parâmetro ID
- O event_id é carregado automaticamente nas listagens e visualizações

## Estrutura do Módulo

```
app/modules/agent/
├── controllers/
│   └── agents_controller.ts      # Controlador com lógica dos endpoints
├── models/
│   └── agent.ts                   # Modelo Lucid ORM
├── services/
│   └── agent_service.ts           # Serviço com lógica de negócio
├── validators/
│   ├── create_agent_validator.ts  # Validação de criação
│   └── update_agent_validator.ts  # Validação de atualização
├── dtos/
│   └── agent_dto.ts               # Data Transfer Object
├── types/
│   ├── agent.ts                   # Interfaces TypeScript
│   └── index.ts                   # Exports
├── routes.ts                      # Definição de rotas
├── index.ts                       # Exports do módulo
└── docs/
    ├── README.md                  # Esta documentação
    └── POSTMAN.md                 # Coleção Postman
```
