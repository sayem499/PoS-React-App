FROM node:20-alpine3.17

RUN mkdir -p /app/backend
WORKDIR /app/backend

COPY package.json /app/backend
COPY package-lock.json /app/backend
COPY .env /app/backend/

RUN npm install --silent

COPY . /app/backend

EXPOSE 5000

CMD [ "npm" , "start" ]