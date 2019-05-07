FROM node:10-alpine

RUN apk update && apk upgrade
RUN apk add --no-cache --virtual builds-deps build-base python git
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g node-gyp
RUN npm install -g license-checker
RUN npm install -g sequelize-cli

RUN npm install
COPY . .

CMD [ "npm", "run", "start:prod" ]
