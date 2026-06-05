# Documentação do CRUD de Dealers

## Visão Geral

O módulo de Dealers fornece um CRUD completo para gerenciar dealers (revendedores) associados a eventos. Cada dealer possui um responsável (user_id) que é carregado nas requisições de listagem e visualização.

## Estrutura de Dados

### Dealer
- **id**: Identificador único (auto-incrementado)
- **uuid**: Identificador único universal (único)
- **eventId**: Referência ao evento (obrigatório)
- **name**: Nome do dealer (obrigatório, 3-255 caracteres)
- **userId**: ID do usuário responsável (obrigatório)
- **user**: Objeto do usuário responsável (carregado automaticamente)
  - **id**: ID do usuário
  - **name**: Nome do usuário
  - **email**: Email do usuário
- **createdAt**: Data de criação
- **updatedAt**: Data da última atualização

## Endpoints

### 1. Listar Todos os Dealers

```
GET /api/dealer/dealers
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "eventId": 1,
    "name": "Dealer XYZ",
    "userId": 5,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "user": {
      "id": 5,
      "name": "João Silva",
      "email": "joao@example.com"
    }
  }
]
```

### 2. Obter um Dealer Específico

```
GET /api/dealer/dealers/{id}
```

**Parâmetros:**
- `id`: ID ou UUID do dealer

**Resposta (200 OK):**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "eventId": 1,
  "name": "Dealer XYZ",
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

**Resposta (404 Not Found):**
```json
{
  "message": "Dealer not found"
}
```

### 3. Criar um Novo Dealer

```
POST /api/dealer/dealers
```

**Corpo da Requisição:**
```json
{
  "eventId": 1,
  "name": "Novo Dealer",
  "userId": 5
}
```

**Validações:**
- `eventId`: Deve ser um número positivo (obrigatório)
- `name`: String de 3 a 255 caracteres (obrigatório)
- `userId`: Deve ser um número positivo (obrigatório)

**Resposta (201 Created):**
```json
{
  "id": 2,
  "uuid": "550e8400-e29b-41d4-a716-446655440001",
  "eventId": 1,
  "name": "Novo Dealer",
  "userId": 5,
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z",
  "user": {
    "id": 5,
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

### 4. Atualizar um Dealer

```
PATCH /api/dealer/dealers/{id}
```

**Parâmetros:**
- `id`: ID ou UUID do dealer

**Corpo da Requisição (todos os campos opcionais):**
```json
{
  "eventId": 2,
  "name": "Dealer Atualizado",
  "userId": 6
}
```

**Validações:**
- `eventId`: Número positivo (opcional)
- `name`: String de 3 a 255 caracteres (opcional)
- `userId`: Número positivo (opcional)

**Resposta (200 OK):**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "eventId": 2,
  "name": "Dealer Atualizado",
  "userId": 6,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:15:00.000Z",
  "user": {
    "id": 6,
    "name": "Maria Santos",
    "email": "maria@example.com"
  }
}
```

### 5. Deletar um Dealer

```
DELETE /api/dealer/dealers/{id}
```

**Parâmetros:**
- `id`: ID ou UUID do dealer

**Resposta (200 OK):**
```json
{
  "message": "Dealer deleted successfully"
}
```

**Resposta (404 Not Found):**
```json
{
  "message": "Dealer not found"
}
```

## Como Usar

### Exemplo: Criar um Dealer

1. Certifique-se de que você tem:
   - `eventId` de um evento existente
   - `userId` de um usuário existente (o responsável)
   - Um `name` para o dealer (3-255 caracteres)

2. Envie uma requisição POST para `/api/dealer/dealers`:
```bash
curl -X POST http://localhost:3333/api/dealer/dealers \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": 1,
    "name": "Dealer ABC",
    "userId": 5
  }'
```

### Exemplo: Atualizar um Dealer

```bash
curl -X PATCH http://localhost:3333/api/dealer/dealers/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dealer ABC Atualizado"
  }'
```

### Exemplo: Deletar um Dealer

```bash
curl -X DELETE http://localhost:3333/api/dealer/dealers/1
```

## Notas Importantes

- O UUID é gerado automaticamente ao criar um dealer
- O responsável (usuário) é sempre carregado nas respostas de GET e POST
- As datas são retornadas no formato ISO 8601
- Todos os dealers são associados a um evento que não pode ser deletado sem deletar os dealers primeiro (constraint de foreign key com CASCADE)
- Todos os dealers são associados a um usuário que não pode ser deletado sem deletar os dealers primeiro (constraint de foreign key com CASCADE)
