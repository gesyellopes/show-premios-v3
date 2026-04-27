FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

# Debug: lista os arquivos do módulo storage
RUN find /app/app/modules -type f | sort

EXPOSE 3333

CMD ["node", "ace", "webhook:worker"]