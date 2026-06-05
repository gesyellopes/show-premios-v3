# Guia de Uso - CRUD de Eventos

## Visão Geral

Este documento descreve como utilizar o módulo de CRUD de Eventos da API. O módulo permite criar, ler, atualizar e excluir eventos.

## Estrutura de um Evento

Um evento possui os seguintes campos:

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `id` | `number` | Identificador único do evento | Gerado automaticamente |
| `name` | `string` | Nome do evento | Obrigatório, máx 255 caracteres |
| `draw` | `number` | Tiragem do evento | Obrigatório, número positivo, máx 999999999 |
| `prefix` | `string` | Prefixo do evento | Obrigatório, 1-2 caracteres |
| `createdAt` | `string` (ISO 8601) | Data de criação | Gerado automaticamente |
| `updatedAt` | `string` (ISO 8601) | Data de atualização | Gerado automaticamente |

## Endpoints Disponíveis

### 1. Listar Todos os Eventos

**Requisição:**
```
GET /api/event/events
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Loteria Nacional",
    "draw": 500000,
    "prefix": "LN",
    "createdAt": "2026-06-04T22:21:00.000Z",
    "updatedAt": "2026-06-04T22:21:00.000Z"
  },
  {
    "id": 2,
    "name": "Mega Sorte",
    "draw": 250000,
    "prefix": "MS",
    "createdAt": "2026-06-04T22:22:00.000Z",
    "updatedAt": "2026-06-04T22:22:00.000Z"
  }
]
```

---

### 2. Buscar um Evento por ID

**Requisição:**
```
GET /api/event/events/:id
```

**Parâmetros:**
- `id` (obrigatório): ID do evento

**Resposta (200 OK):**
```json
{
  "id": 1,
  "name": "Loteria Nacional",
  "draw": 500000,
  "prefix": "LN",
  "createdAt": "2026-06-04T22:21:00.000Z",
  "updatedAt": "2026-06-04T22:21:00.000Z"
}
```

**Resposta (404 Not Found):**
```json
{
  "message": "Event with id 999 not found"
}
```

---

### 3. Criar um Novo Evento

**Requisição:**
```
POST /api/event/events
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Loteria Nacional",
  "draw": 500000,
  "prefix": "LN"
}
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "name": "Loteria Nacional",
  "draw": 500000,
  "prefix": "LN",
  "createdAt": "2026-06-04T22:21:00.000Z",
  "updatedAt": "2026-06-04T22:21:00.000Z"
}
```

**Resposta (400 Bad Request):**
```json
{
  "message": "Validation failed"
}
```

---

### 4. Atualizar um Evento

**Requisição:**
```
PATCH /api/event/events/:id
Content-Type: application/json
```

**Parâmetros:**
- `id` (obrigatório): ID do evento

**Body (todos os campos são opcionais):**
```json
{
  "name": "Loteria Nacional Atualizada",
  "draw": 600000,
  "prefix": "LNA"
}
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "name": "Loteria Nacional Atualizada",
  "draw": 600000,
  "prefix": "LNA",
  "createdAt": "2026-06-04T22:21:00.000Z",
  "updatedAt": "2026-06-04T22:25:30.000Z"
}
```

**Resposta (404 Not Found):**
```json
{
  "message": "Event with id 999 not found"
}
```

---

### 5. Excluir um Evento

**Requisição:**
```
DELETE /api/event/events/:id
```

**Parâmetros:**
- `id` (obrigatório): ID do evento

**Resposta (200 OK):**
```json
{
  "id": 1,
  "deleted": true
}
```

**Resposta (404 Not Found):**
```json
{
  "message": "Event with id 999 not found"
}
```

---

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| `200` | Sucesso na operação |
| `201` | Recurso criado com sucesso |
| `400` | Erro de validação |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |

## Exemplos de Uso com cURL

### Listar eventos
```bash
curl -X GET http://localhost:3333/api/event/events
```

### Criar um evento
```bash
curl -X POST http://localhost:3333/api/event/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Loteria Nacional",
    "draw": 500000,
    "prefix": "LN"
  }'
```

### Buscar um evento específico
```bash
curl -X GET http://localhost:3333/api/event/events/1
```

### Atualizar um evento
```bash
curl -X PATCH http://localhost:3333/api/event/events/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Loteria Atualizada",
    "draw": 600000
  }'
```

### Excluir um evento
```bash
curl -X DELETE http://localhost:3333/api/event/events/1
```

## Notas Importantes

- A `tiragem` deve ser um número positivo (máximo 999999999)
- O `prefixo` aceita apenas 1 ou 2 caracteres
- O `nome` do evento não pode estar vazio e tem limite de 255 caracteres
- Ao atualizar um evento, você pode enviar apenas os campos que deseja modificar
- As datas (createdAt, updatedAt) são retornadas no formato ISO 8601
