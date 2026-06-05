# Guia de Setup - Módulo User

## Instalação e Configuração

### 1. Dependências Necessárias

O projeto deve ter as seguintes dependências instaladas:

```bash
npm install @adonisjs/core
npm install @adonisjs/lucid
npm install @vinejs/vine
```

Se ainda não estiverem instaladas, execute:

```bash
cd c:\show-worker\show-premios-v3
npm install
```

**Nota:** O módulo UUID usa o `randomUUID` nativo do Node.js, não requer instalação adicional.

### 2. Estrutura de Arquivos Criada

```
app/modules/user/
├── controllers/
│   └── users_controller.ts          # Controller com ações CRUD e login
├── services/
│   ├── user_service.ts              # Serviço CRUD de usuários
│   └── auth_service.ts              # Serviço de autenticação/login
├── models/
│   └── user.ts                      # Modelo User atualizado
├── validators/
│   ├── create_user_validator.ts     # Validação para criação
│   ├── update_user_validator.ts     # Validação para atualização
│   └── login_validator.ts           # Validação para login
├── types/
│   ├── user.ts                      # Interfaces TypeScript
│   └── index.ts                     # Exports de tipos
├── dtos/
│   └── user_dto.ts                  # DTO do usuário
├── docs/
│   ├── README.md                    # Documentação completa da API
│   ├── SETUP.md                     # Este arquivo
│   └── postman_collection.json      # Collection do Postman
├── routes.ts                        # Rotas do módulo
└── index.ts                         # Exports do módulo
```

### 3. Rotas Registradas

As rotas estão prefixadas em `/api/user`:

#### CRUD de Usuários
- `GET /api/user/users` - Listar todos os usuários
- `GET /api/user/users/:id` - Obter usuário por ID
- `POST /api/user/users` - Criar novo usuário
- `PUT /api/user/users/:id` - Atualizar usuário
- `DELETE /api/user/users/:id` - Deletar usuário

#### Autenticação
- `POST /api/user/login` - Fazer login e obter token

### 4. Executar Migrations

A migration para criar a tabela `users` já foi criada e executada:

```bash
# Verificar status das migrations
node ace migration:status

# Executar migrations pendentes (se houver)
node ace migration:run
```

### 5. Testando a API

#### Com cURL

**Criar um usuário:**
```bash
curl -X POST http://localhost:3333/api/user/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "11987654321",
    "password": "senha_segura_123",
    "role": "admin"
  }'
```

**Fazer login (por email):**
```bash
curl -X POST http://localhost:3333/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "joao@example.com",
    "password": "senha_segura_123"
  }'
```

**Fazer login (por telefone):**
```bash
curl -X POST http://localhost:3333/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "11987654321",
    "password": "senha_segura_123"
  }'
```

#### Com Postman

1. Abra o Postman
2. Clique em "Import"
3. Cole o conteúdo do arquivo `postman_collection.json` ou importe diretamente do arquivo
4. Atualize a variável `base_url` se necessário (padrão: `http://localhost:3333`)
5. Teste os endpoints

### 6. Estrutura de Resposta

#### Sucesso (200/201)
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

#### Erro (400/404)
```json
{
  "errors": [
    {
      "message": "E_VALIDATION_ERROR",
      "errors": [
        {
          "rule": "required",
          "field": "email",
          "message": "The email field is required"
        }
      ]
    }
  ]
}
```

### 7. Validações

#### Criação de Usuário
- `name`: Mínimo 3, máximo 255 caracteres (obrigatório)
- `email`: Deve ser válido e único (opcional) - Se não informado, é gerado automaticamente como `{telefone}@showdepremios.cloud`
- `phone`: 10-11 dígitos apenas (obrigatório)
- `password`: Mínimo 8 caracteres (obrigatório)
- `role`: admin, manager ou vendor (padrão: vendor)

#### Atualização de Usuário
Todos os campos são opcionais, com as mesmas validações da criação.

#### Login (por Email ou Telefone)
- `login`: Pode ser email ou telefone (obrigatório)
- `password`: Mínimo 8 caracteres (obrigatório)

### 8. Token de Autenticação

O endpoint de login retorna um token que pode ser usado em requisições futuras:

```json
{
  "data": {
    "type": "bearer",
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
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

### 9. Iniciar o Servidor

```bash
cd c:\show-worker\show-premios-v3

# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

O servidor estará disponível em `http://localhost:3333` por padrão.

### 10. Troubleshooting

#### Erro: "Table 'users' already exists"
A tabela já foi criada anteriormente. A migration foi atualizada para verificar isso.

#### Erro: "User not found" no login
Verifique se:
1. O usuário foi criado corretamente
2. O email está correto
3. A senha está correta (sensível a maiúsculas/minúsculas)

#### Erro: "E_VALIDATION_ERROR"
Verifique:
1. Se todos os campos obrigatórios foram enviados
2. Se o email é válido e único
3. Se a senha tem pelo menos 8 caracteres
4. Se o phone (se fornecido) tem 10-11 dígitos

## Próximos Passos

Para integrar autenticação em toda a aplicação:

1. Criar middleware de autenticação baseado no token
2. Implementar autorização por role (admin, manager, vendor)
3. Adicionar refresh token para renovar autenticação
4. Implementar senha recuperada/reset
5. Adicionar 2FA se necessário

Consulte o arquivo `README.md` para documentação completa da API.
