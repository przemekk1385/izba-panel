FROM node:lts-alpine

RUN mkdir -p /usr/local/src/app
WORKDIR /usr/local/src/app

RUN npm install -g http-server

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["http-server", "dist"]
