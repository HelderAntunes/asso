FROM node:carbon

WORKDIR /app

COPY package*.json ./
COPY src /app

RUN npm install -g nodemon
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
