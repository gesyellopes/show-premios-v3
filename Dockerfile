# Estágio 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

RUN node ace build --ignore-ts-errors

# Estágio 2: Produção
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV LOG_LEVEL=info

COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

RUN npm prune --production

# Criar a pasta de logs onde o AdonisJS realmente procura (dentro de /app/build/logs)
# e dar permissão ao usuário node
RUN mkdir -p /app/build/logs && chown -R node:node /app/build

USER node

EXPOSE 3333

CMD ["node", "build/bin/server.js"]