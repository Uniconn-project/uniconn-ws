FROM node:14.17-alpine

WORKDIR /code

COPY package.json /code/
RUN npm install

COPY . /code/

EXPOSE 3030
