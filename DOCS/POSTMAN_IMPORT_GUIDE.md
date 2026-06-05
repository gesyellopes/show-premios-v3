# Guia de Importação - Postman

## Como Importar a Collection no Postman

Este guia descreve como importar a collection de APIs de Eventos no Postman.

## Pré-requisitos

- Postman instalado (versão 8.0 ou superior recomendada)
- URL da API disponível e rodando

## Passos para Importação

### Opção 1: Importar via Arquivo JSON

1. **Abra o Postman**

2. **Clique no botão "Import"**
   - Localizado no canto superior esquerdo da janela principal
   - Ou use o atalho `Ctrl + O`

3. **Selecione "Upload Files"**
   - Na janela que aparece, escolha a aba "Upload Files"

4. **Selecione o arquivo JSON**
   - Navegue até a pasta `DOCS`
   - Selecione o arquivo `Eventos_API.postman_collection.json`

5. **Clique em "Import"**
   - O arquivo será importado e a collection aparecerá no painel esquerdo

### Opção 2: Importar via Link (se disponível)

1. **Clique no botão "Import"**

2. **Selecione a aba "Link"**

3. **Cole o link da collection** (se disponível)

4. **Clique em "Continue"** e depois **"Import"**

## Configurando Variáveis de Ambiente

Após importar a collection, você precisa configurar as variáveis de ambiente:

### Passo 1: Criar um Environment

1. **Clique em "Environments"** (lado esquerdo do Postman)

2. **Clique em "Create New Environment"** (ícone de `+`)

3. **Nomeie o environment** (ex: "Local Development")

### Passo 2: Adicionar Variáveis

Na aba "Initial value" e "Current value", adicione:

| Variável | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3333` | `http://localhost:3333` |
| `event_id` | `1` | `1` |

### Passo 3: Salvar o Environment

1. **Clique no botão "Save"** (canto inferior direito da janela de ambiente)

2. **Feche a janela**

3. **Selecione o environment** no dropdown do canto superior direito do Postman

## Usando a Collection

Após importar, você verá a collection "Eventos API - CRUD" no painel esquerdo com os seguintes endpoints:

### Endpoints Disponíveis

```
📁 Events
  ├── GET    Listar Todos os Eventos
  ├── GET    Buscar Evento por ID
  ├── POST   Criar Novo Evento
  ├── PATCH  Atualizar Evento
  └── DELETE Excluir Evento
```

## Exemplos de Uso

### 1. Listar Eventos

1. Clique em "Listar Todos os Eventos"
2. Clique em "Send"

**Resposta esperada:**
```json
[
  {
    "id": 1,
    "name": "Loteria Nacional",
    "draw": 500000,
    "prefix": "LN",
    "createdAt": "2026-06-04T22:21:00.000Z",
    "updatedAt": "2026-06-04T22:21:00.000Z"
  }
]
```

### 2. Criar um Novo Evento

1. Clique em "Criar Novo Evento"
2. No tab "Body", você verá um JSON de exemplo:
   ```json
   {
     "name": "Loteria Nacional",
     "draw": 500000,
     "prefix": "LN"
   }
   ```
3. Modifique os dados conforme necessário
4. Clique em "Send"

**Resposta esperada:**
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

### 3. Buscar um Evento

1. Clique em "Buscar Evento por ID"
2. Na URL, mude o ID conforme necessário: `/api/event/events/1`
3. Clique em "Send"

### 4. Atualizar um Evento

1. Clique em "Atualizar Evento"
2. Na URL, mude o ID: `/api/event/events/1`
3. No tab "Body", modifique os dados:
   ```json
   {
     "name": "Novo Nome",
     "draw": 600000
   }
   ```
4. Clique em "Send"

### 5. Excluir um Evento

1. Clique em "Excluir Evento"
2. Na URL, mude o ID: `/api/event/events/1`
3. Clique em "Send"

## Validação Automática

A collection inclui testes automáticos em cada endpoint que validam:

- **Status HTTP correto** (200, 201, 400, 404, etc.)
- **Presença de campos obrigatórios** na resposta
- **Tipo de dados corretos**

Os resultados dos testes aparecem na aba "Test Results" após cada requisição.

## Dicas Úteis

### Usar Variáveis na URL

Se você configurou corretamente o environment, use:
- `{{base_url}}` para a URL base (será substituída por `http://localhost:3333`)
- `{{event_id}}` para o ID do evento

### Exemplo com Variável
```
{{base_url}}/api/event/events/{{event_id}}
```

### Reutilizar IDs de Respostas Anteriores

A requisição "Criar Novo Evento" salva automaticamente o ID da resposta na variável `event_id`. Você pode então usar esta variável em outras requisições.

## Troubleshooting

### Erro: "Unable to connect"

- Verifique se a API está rodando: `node ace serve`
- Confirme a URL base no environment
- Verifique a conexão de internet

### Erro: "Request timed out"

- A API pode estar lenta
- Aumente o timeout nas configurações do Postman (Settings → General)

### Erro 400: "Validation failed"

- Verifique os dados no body
- Confirme se todos os campos obrigatórios estão presentes
- Valide o tipo de dados (string, number, etc.)

## Suporte

Para mais informações sobre a API, consulte:
- `EVENTOS_CRUD_GUIDE.md` - Documentação detalhada dos endpoints
- Código-fonte em `app/modules/event/`
