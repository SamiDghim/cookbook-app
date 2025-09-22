FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN npm ci --silent || npm install --silent

COPY . .

RUN npm run init-db

EXPOSE 4000

CMD [ "node", "server.js" ]
