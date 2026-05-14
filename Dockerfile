FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install --include=dev

COPY . .

EXPOSE 3333

CMD ["node", "ace", "serve", "--watch"]
#CMD ["node", "ace", "webhook:worker"]
