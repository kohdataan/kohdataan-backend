FROM node:10-alpine

RUN apk update && apk upgrade
RUN apk add --no-cache git
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN npm install -g license-checker

COPY . .

CMD [ "npm", "run", "start:prod" ]
