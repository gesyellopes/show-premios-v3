FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

# Mesma versão do pnpm usada no desenvolvimento (ver pnpm-lock.yaml)
RUN npm install -g pnpm@11.12.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3333

#CMD ["node", "ace", "serve", "--watch"]
CMD ["node", "ace", "webhook:worker"]
