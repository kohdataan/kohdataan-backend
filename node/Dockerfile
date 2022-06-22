FROM node:16-alpine

WORKDIR /usr/src/app

RUN apk update && apk upgrade
RUN apk add --no-cache --virtual builds-deps build-base python3 git
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
RUN npm install node-gyp --location=global
RUN npm install license-checker --location=global
RUN npm install sequelize-cli --location=global
RUN npm install cron

RUN npm install
COPY . .

CMD [ "npm", "run", "start:prod" ]
