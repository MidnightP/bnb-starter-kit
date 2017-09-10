FROM node:8.4-alpine

RUN echo "@edge http://nl.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories

RUN apk update
RUN apk add nano

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app
COPY server       /app/server
COPY build        /app/build

RUN npm install --silent --only=production

EXPOSE 5000 4000

CMD ["npm" "run" "start:prod"]
