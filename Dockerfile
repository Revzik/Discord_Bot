FROM node:14-alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY src/* src/

ARG TOKEN
ENV TOKEN=$TOKEN

CMD ["node", "src/index.js"]