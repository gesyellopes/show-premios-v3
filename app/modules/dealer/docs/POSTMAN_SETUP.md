# Como Importar a Coleção Postman

## Opção 1: Importar via Arquivo JSON

### Passo 1: Abrir o Postman
- Abra o aplicativo Postman ou acesse [postman.com](https://postman.com)

### Passo 2: Acessar a opção de Importar
- Clique em **"Import"** no canto superior esquerdo
- Ou use o atalho: `Ctrl + O` (Windows) ou `Cmd + O` (Mac)

### Passo 3: Selecionar o arquivo
- Na janela de importação, escolha **"Upload Files"**
- Navegue até `app/modules/dealer/docs/dealers_postman_collection.json`
- Selecione o arquivo e clique em **"Open"**

### Passo 4: Confirmar importação
- Clique em **"Import"** para completar o processo
- A coleção "Dealer CRUD API" aparecerá na sua lista de coleções

## Opção 2: Importar via Link Direto

Se você tiver hospedado o arquivo em um servidor:
- Na janela de importação, escolha **"Link"**
- Cole a URL do arquivo `dealers_postman_collection.json`
- Clique em **"Continue"** e depois **"Import"**

## Configurar a Variável de Ambiente

Após importar, é importante configurar a variável `base_url`:

### Passo 1: Acessar Environment
- Clique em **"Environments"** no painel esquerdo
- Clique em **"Create"** ou selecione um ambiente existente

### Passo 2: Adicionar/Atualizar a Variável
- Procure pela variável `base_url`
- Atualize o valor conforme necessário:
  - **Desenvolvimento**: `http://localhost:3333`
  - **Produção**: `https://seu-dominio.com`

### Passo 3: Salvar
- Clique em **"Save"** ou use `Ctrl + S`

## Estrutura da Coleção

A coleção contém as seguintes requisições:

### 📋 Dealers (Pasta)

1. **Listar todos os Dealers**
   - Método: `GET`
   - URL: `{{base_url}}/api/dealer/dealers`
   - Retorna lista de todos os dealers com informações do responsável

2. **Obter Dealer por ID**
   - Método: `GET`
   - URL: `{{base_url}}/api/dealer/dealers/1`
   - Retorna um dealer específico (substitua `1` pelo ID ou UUID)

3. **Criar novo Dealer**
   - Método: `POST`
   - URL: `{{base_url}}/api/dealer/dealers`
   - Body (JSON):
     ```json
     {
       "eventId": 1,
       "name": "Dealer XYZ",
       "userId": 5
     }
     ```

4. **Atualizar Dealer**
   - Método: `PATCH`
   - URL: `{{base_url}}/api/dealer/dealers/1`
   - Body (JSON - todos os campos opcionais):
     ```json
     {
       "name": "Dealer XYZ Atualizado",
       "userId": 6
     }
     ```

5. **Deletar Dealer**
   - Método: `DELETE`
   - URL: `{{base_url}}/api/dealer/dealers/1`
   - Sem body necessário

## Dicas Úteis

### Usar Scripts de Pré-requisição
Para automatizar testes, você pode adicionar scripts antes/depois das requisições:

**Exemplo: Salvar ID do Dealer criado**
```javascript
if (pm.response.code === 201) {
  const jsonData = pm.response.json();
  pm.environment.set("dealer_id", jsonData.id);
}
```

### Usar o Test Script
**Exemplo: Validar resposta de sucesso**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has ID", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
});
```

### Encadeamento de Requisições
1. Crie um dealer via POST
2. Use o ID retornado para GET
3. Atualize usando PATCH
4. Delete usando DELETE

Você pode fazer isso manualmente ou usando scripts de pré-requisição com variáveis de ambiente.

## Troubleshooting

### Erro 404 - Dealer not found
- Verifique se o ID ou UUID existe
- Certifique-se de que está usando o `base_url` correto

### Erro 422 - Validação falhou
- Verifique se todos os campos obrigatórios foram enviados
- Confirme que os valores estão no formato correto:
  - `eventId`: número positivo
  - `name`: string 3-255 caracteres
  - `userId`: número positivo

### Erro 500 - Server Error
- Verifique se o servidor está rodando
- Confira os logs do servidor para mais detalhes
- Verifique se os IDs de `eventId` e `userId` existem no banco de dados

## Referência Rápida

| Método | URL | Descrição |
|--------|-----|-----------|
| GET | `/api/dealer/dealers` | Listar todos |
| GET | `/api/dealer/dealers/:id` | Obter um |
| POST | `/api/dealer/dealers` | Criar |
| PATCH | `/api/dealer/dealers/:id` | Atualizar |
| DELETE | `/api/dealer/dealers/:id` | Deletar |

---

Para mais detalhes sobre cada endpoint, consulte [CRUD.md](./CRUD.md)
