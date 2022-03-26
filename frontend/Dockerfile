FROM node:16

# Create app directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

RUN yarn

COPY . .

EXPOSE 3000
CMD [ "yarn", "run", "start" ]