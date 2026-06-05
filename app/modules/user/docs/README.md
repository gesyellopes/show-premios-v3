# Documentação do Módulo User

## Visão Geral

O módulo User fornece um CRUD completo para gerenciar usuários da aplicação, incluindo autenticação básica com login via email e senha.

## Estrutura de Dados

### User Model

```typescript
{
  id: number               // Auto increment (chave primária)
  uuid: string            // Identificador único, gerado automaticamente
  name: string            // Nome do usuário (obrigatório)
  email: string           // Email único (obrigatório)
  phone: string           // Telefone (opcional, apenas números)
  password: string        // Senha criptografada (hash)
  role: enum              // Função do usuário: 'admin' | 'manager' | 'vendor'
  createdAt: datetime     // Data de criação
  updatedAt: datetime     // Data de última atualização
}
```

### Roles Disponíveis

- **admin**: Acesso total ao sistema
- **manager**: Acesso intermediário
- **vendor**: Acesso básico (padrão)

## Endpoints

### 1. Listar Usuários

**Requisição:**
```
GET /api/user/users
```

**Resposta (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@example.com",
      "phone": "11987654321",
      "role": "admin",
      "createdAt": "2024-06-04T10:30:00.000Z",
      "updatedAt": "2024-06-04T10:30:00.000Z"
    }
  ]
}
```

### 2. Obter Usuário por ID

**Requisição:**
```
GET /api/user/users/:id
```

**Exemplo:**
```
GET /api/user/users/1
```

**Resposta (200 OK):**
```json
{
  "data": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "11987654321",
    "role": "admin",
    "createdAt": "2024-06-04T10:30:00.000Z",
    "updatedAt": "2024-06-04T10:30:00.000Z"
  }
}
```

### 3. Criar Usuário

**Requisição:**
```
POST /api/user/users
Content-Type: application/json
```

**Body (exemplo com email):**
```json
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "phone": "11987654321",
  "password": "senha_segura_123",
  "role": "vendor"
}
```

**Body (exemplo SEM email - será gerado automaticamente):**
```json
{
  "name": "João Silva",
  "phone": "11987654321",
  "password": "senha_segura_123",
  "role": "admin"
}
```
Resultado: email será `11987654321@showdepremios.cloud`

**Validações:**
- `name`: Mínimo 3 caracteres, máximo 255 (obrigatório)
- `email`: Deve ser um email válido e único (opcional) - Se não informado, é gerado automaticamente como `{telefone}@showdepremios.cloud`
- `phone`: Apenas dígitos, entre 10 e 11 caracteres (obrigatório, formato brasileiro)
- `password`: Mínimo 8 caracteres (obrigatório)
- `role`: Deve ser 'admin', 'manager' ou 'vendor' (padrão: 'vendor')

**Resposta (201 Created):**
```json
{
  "data": {
    "id": 2,
    "uuid": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Maria Santos",
    "email": "maria@example.com",
    "phone": "11987654321",
    "role": "vendor",
    "createdAt": "2024-06-04T11:00:00.000Z",
    "updatedAt": "2024-06-04T11:00:00.000Z"
  }
}
```

### 4. Atualizar Usuário

**Requisição:**
```
PUT /api/user/users/:id
Content-Type: application/json
```

**Exemplo:**
```
PUT /api/user/users/1
```

**Body (exemplo - todos os campos são opcionais):**
```json
{
  "name": "João Silva Atualizado",
  "phone": "11999999999",
  "password": "nova_senha_123",
  "role": "manager"
}
```

**Validações:** Mesmas do endpoint de criação, mas todos os campos são opcionais.

**Resposta (200 OK):**
```json
{
  "data": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva Atualizado",
    "email": "joao@example.com",
    "phone": "11999999999",
    "role": "manager",
    "createdAt": "2024-06-04T10:30:00.000Z",
    "updatedAt": "2024-06-04T11:15:00.000Z"
  }
}
```

### 5. Deletar Usuário

**Requisição:**
```
DELETE /api/user/users/:id
```

**Exemplo:**
```
DELETE /api/user/users/1
```

**Resposta (200 OK):**
```json
{
  "success": true
}
```

### 6. Login (por Email ou Telefone)

**Requisição:**
```
POST /api/user/login
Content-Type: application/json
```

**Body (Login por Email):**
```json
{
  "login": "joao@example.com",
  "password": "senha_segura_123"
}
```

**Body (Login por Telefone):**
```json
{
  "login": "11987654321",
  "password": "senha_segura_123"
}
```

**Validações:**
- `login`: Pode ser email ou telefone (obrigatório)
- `password`: Mínimo 8 caracteres (obrigatório)

**Resposta (200 OK):**
```json
{
  "data": {
    "type": "bearer",
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    "expiresIn": 7200,
    "user": {
      "id": 1,
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "admin"
    }
  }
}
```

**Erros possíveis:**
- `400 Bad Request`: Email ou senha inválidos
- `404 Not Found`: Usuário não encontrado

## Códigos de Status HTTP

| Status | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Validação falhou |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

## Segurança

- **Senhas**: Todas as senhas são criptografadas usando hash (bcrypt do AdonisJS)
- **UUID**: Cada usuário recebe um identificador único imutável
- **Validação**: Todos os inputs são validados antes de processar
- **Email único**: O email deve ser único no sistema

## Fluxo de Autenticação Recomendado

1. Usuário faz login com POST `/api/user/login`
2. Sistema retorna um token
3. Token deve ser armazenado no cliente (localStorage, sessionStorage ou cookie)
4. Em requisições futuras que exijam autenticação, incluir o token no header `Authorization: Bearer {token}`

## Exemplo de Uso com cURL

```bash
# Criar usuário
curl -X POST http://localhost:3333/api/user/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "11987654321",
    "password": "senha_segura_123",
    "role": "admin"
  }'

# Fazer login (por email)
curl -X POST http://localhost:3333/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "joao@example.com",
    "password": "senha_segura_123"
  }'

# Fazer login (por telefone)
curl -X POST http://localhost:3333/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "11987654321",
    "password": "senha_segura_123"
  }'

# Listar usuários
curl http://localhost:3333/api/user/users

# Obter usuário específico
curl http://localhost:3333/api/user/users/1

# Atualizar usuário
curl -X PUT http://localhost:3333/api/user/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Atualizado",
    "role": "manager"
  }'

# Deletar usuário
curl -X DELETE http://localhost:3333/api/user/users/1
```
