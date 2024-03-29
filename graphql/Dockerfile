FROM node:latest

WORKDIR /usr/src/app


COPY --chown=node:node package*.json ./
USER root
RUN npm install -g typescript

COPY --chown=node:node . .
RUN chown -R node:node /usr/src/app
USER node
RUN npm install @types/node
RUN tsc

EXPOSE 5000

CMD ["node", "index.js"]