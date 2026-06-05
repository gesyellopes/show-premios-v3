# Coleção Postman - Agent CRUD

## Instruções de Importação

### Opção 1: Importar do Arquivo JSON (RECOMENDADO)

1. Abra o [Postman](https://www.postman.com/)
2. Clique em "Import" (ou ⌘ + O no Mac / Ctrl + O no Windows)
3. Selecione a aba "File" ou "Upload Files"
4. Escolha o arquivo `postman.json` desta pasta
5. Clique em "Import"
6. As rotas e a variável `base_url` serão importadas automaticamente

### Opção 2: Importar do JSON Raw

1. Abra o [Postman](https://www.postman.com/)
2. Clique em "Import" (ou ⌘ + O no Mac / Ctrl + O no Windows)
3. Selecione a aba "Raw text"
4. Copie o conteúdo do arquivo `postman.json`
5. Cole no campo de texto
6. Clique em "Continue" e depois "Import"

### Opção 3: Importação Manual

1. Abra o [Postman](https://www.postman.com/)
2. Clique em "Collections" na barra esquerda
3. Crie uma nova collection chamada "Agent CRUD"
4. Crie um novo Request para cada endpoint (veja seção "Endpoints" abaixo)
5. Configure o método, URL e headers conforme especificado

### Configurar o Environment (Todas as Opções)

1. Clique em "Environments" na barra esquerda
2. Crie um novo environment ou use o existente
3. Configure a variável `base_url` com o valor: `http://localhost:3333`
4. Clique em "Save"
5. Selecione o environment criado no dropdown no canto superior direito

---

## JSON da Coleção Postman

Copie o JSON abaixo e importe no Postman:

```json
{
  "info": {
    "name": "Agent CRUD",
    "description": "API para gerenciamento de Agents",
    "version": "1.0.0",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Listar Todos os Agents",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/agent/agents",
          "host": [
            "{{base_url}}"
          ],
          "path": [
            "api",
            "agent",
            "agents"
          ]
        },
        "description": "Retorna uma lista de todos os agents cadastrados"
      },
      "response": []
    },
    {
      "name": "Visualizar Agent por ID",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/agent/agents/1",
          "host": [
            "{{base_url}}"
          ],
          "path": [
            "api",
            "agent",
            "agents",
            "1"
          ]
        },
        "description": "Retorna as informações de um agent específico (use ID ou UUID)"
      },
      "response": []
    },
    {
      "name": "Criar Novo Agent",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"eventId\": 1,\n  \"name\": \"Agent de Vendas\",\n  \"userId\": 1\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/agent/agents",
          "host": [
            "{{base_url}}"
          ],
          "path": [
            "api",
            "agent",
            "agents"
          ]
        },
        "description": "Cria um novo agent. UUID é gerado automaticamente."
      },
      "response": []
    },
    {
      "name": "Atualizar Agent",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"eventId\": 2,\n  \"name\": \"Agent de Vendas Premium\",\n  \"userId\": 2\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/agent/agents/1",
          "host": [
            "{{base_url}}"
          ],
          "path": [
            "api",
            "agent",
            "agents",
            "1"
          ]
        },
        "description": "Atualiza um agent existente (use ID ou UUID)"
      },
      "response": []
    },
    {
      "name": "Deletar Agent",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/agent/agents/1",
          "host": [
            "{{base_url}}"
          ],
          "path": [
            "api",
            "agent",
            "agents",
            "1"
          ]
        },
        "description": "Deleta um agent do sistema (use ID ou UUID)"
      },
      "response": []
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3333",
      "type": "default"
    }
  ]
}
```

---

## Endpoints

### 1. Listar Todos os Agents
- **Método:** GET
- **URL:** `{{base_url}}/api/agent/agents`
- **Headers:**
  - `Accept: application/json`
- **Body:** Não requerido

### 2. Visualizar Agent por ID ou UUID
- **Método:** GET
- **URL:** `{{base_url}}/api/agent/agents/:id`
- **Headers:**
  - `Accept: application/json`
- **Body:** Não requerido
- **Parâmetro:** `:id` pode ser o ID numérico ou UUID

### 3. Criar Novo Agent
- **Método:** POST
- **URL:** `{{base_url}}/api/agent/agents`
- **Headers:**
  - `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "eventId": 1,
    "name": "Agent de Vendas",
    "userId": 1
  }
  ```
- **Campos Obrigatórios:**
  - `eventId` (número inteiro positivo)
  - `name` (string, 3-255 caracteres)
  - `userId` (número inteiro positivo)

### 4. Atualizar Agent
- **Método:** PUT
- **URL:** `{{base_url}}/api/agent/agents/:id`
- **Headers:**
  - `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "eventId": 2,
    "name": "Agent Atualizado",
    "userId": 2
  }
  ```
- **Campos Opcionais:**
  - `eventId` (número inteiro positivo)
  - `name` (string, 3-255 caracteres)
  - `userId` (número inteiro positivo)
- **Parâmetro:** `:id` pode ser o ID numérico ou UUID

### 5. Deletar Agent
- **Método:** DELETE
- **URL:** `{{base_url}}/api/agent/agents/:id`
- **Headers:**
  - `Accept: application/json`
- **Body:** Não requerido
- **Parâmetro:** `:id` pode ser o ID numérico ou UUID

---

## Como Usar no Postman

### Opção 1: Importar do JSON Raw

1. No Postman, clique em "Import"
2. Selecione a aba "Raw text"
3. Cole todo o JSON da coleção acima
4. Clique em "Continue" e depois "Import"

### Opção 2: Criar Manualmente

1. Crie uma nova Collection chamada "Agent CRUD"
2. Crie um novo Request para cada endpoint
3. Configure o método, URL e headers conforme especificado
4. Salve cada request

### Opção 3: Usar a URL de Importação

1. Se tiver uma URL pública da collection, clique em "Import"
2. Selecione "Link"
3. Cole a URL
4. Clique em "Import"

---

## Variáveis do Postman

### base_url
- **Descrição:** URL base da API
- **Valor padrão:** `http://localhost:3333`
- **Como usar:** Nas URLs dos requests, utilize `{{base_url}}`

---

## Exemplos de Resposta

### Sucesso ao Listar (200 OK)
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

### Sucesso ao Criar (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 2,
    "uuid": "660e8400-e29b-41d4-a716-446655440001",
    "eventId": 1,
    "name": "Agent de Vendas",
    "userId": 1,
    "createdAt": "2026-06-04T10:35:00.000Z",
    "updatedAt": "2026-06-04T10:35:00.000Z"
  },
  "message": "Agent criado com sucesso"
}
```

### Erro ao Validar (400 Bad Request)
```json
{
  "success": false,
  "message": "Erro ao criar agent",
  "error": "Detalhes do erro de validação"
}
```

### Não Encontrado (404 Not Found)
```json
{
  "success": false,
  "message": "Agent não encontrado"
}
```

---

## Dicas Importantes

1. **Sempre configure a variável `base_url`** antes de usar os requests
2. **Use IDs numéricos ou UUIDs** nos endpoints de busca, atualização e deleção
3. **Verifique o Content-Type** ao fazer POST e PUT
4. **Valide os campos obrigatórios** antes de enviar
5. **Teste os endpoints na ordem:** Criar → Listar → Visualizar → Atualizar → Deletar

---

## Arquivo JSON da Coleção

O arquivo **[postman.json](./postman.json)** contém a coleção completa pronta para importar no Postman.

Para importar:
1. Abra o Postman
2. Clique em "Import"
3. Selecione "Upload Files"
4. Escolha o arquivo `postman.json`
5. Clique em "Import"

---

## Suporte

Para mais informações sobre a API, consulte o arquivo [README.md](./README.md)
