#FROM node:10-alpine
FROM node:10.15.2-jessie

RUN apt-get update && apt-get upgrade \
    && apt-get install bash git

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["yarn", "run", "gulp"]

#USER node
#
##ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
##ENV PATH=$PATH:/home/node/.npm-global/bin
#
## Create app directory
#WORKDIR /home/node/app
#
## Install app dependencies
## A wildcard is used to ensure both package.json AND package-lock.json are copied
## where available (npm@5+)
#COPY package*.json ./
## If you are building your code for production
## RUN npm ci --only=production
#
##RUN chown node:node /var/www
#RUN yarn install
##
### Bundle app source
#COPY . .
#
#EXPOSE 3000/tcp

#CMD ["yarn", "run", "gulp"]