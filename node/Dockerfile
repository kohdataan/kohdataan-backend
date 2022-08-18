FROM node:16.16.0-alpine

WORKDIR /usr/src/app

RUN apk update && apk upgrade
RUN apk add --no-cache --virtual builds-deps build-base python3 git

COPY . .

RUN npm install node-gyp --location=global
RUN npm install license-checker --location=global
RUN npm install sequelize-cli --location=global
RUN npm install

CMD ["npm", "run", "start"]
