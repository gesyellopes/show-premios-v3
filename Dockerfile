# Estágio 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências necessárias para pacotes nativos (se houver)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

# Executa o build do AdonisJS (gera a pasta /build)
RUN node ace build

# Estágio 2: Produção
FROM node:20-alpine

WORKDIR /app

# Variáveis de ambiente de produção
ENV NODE_ENV=production
ENV LOG_LEVEL=info

# Copiar apenas os arquivos necessários do estágio de build
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Instalar apenas dependências de produção (limpa o que for devDependencies)
RUN npm prune --production

# Criar a pasta de logs e dar permissão ao usuário node
# Isso é importante pois configuramos o logger para salvar em arquivo
RUN mkdir -p /app/logs && chown -R node:node /app/logs

# Usar o usuário não-root do Alpine por segurança
USER node

# Porta padrão da API
EXPOSE 3333

# Comando padrão (inicia a API)
# Para rodar o worker, você sobrescreve este comando no Docker Compose ou na execução
CMD ["node", "build/bin/server.js"]

# Comando para rodar o worker (comente a linha acima e descomente esta se quiser que este container seja apenas worker)
# CMD ["node", "build/ace", "webhook:worker"]