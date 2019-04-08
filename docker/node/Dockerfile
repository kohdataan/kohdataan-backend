FROM node:10-alpine

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /node

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "run", "start:prod" ]