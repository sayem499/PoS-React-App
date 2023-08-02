FROM node:20-alpine3.17

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent

COPY . /app/

EXPOSE 3000

CMD [ "npm" , "start" ]

