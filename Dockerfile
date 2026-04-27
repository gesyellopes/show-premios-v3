FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

# builda o projeto
RUN node ace build

EXPOSE 3333

CMD ["node", "build/ace", "webhook:worker"]