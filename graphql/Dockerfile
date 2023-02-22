FROM node:latest

WORKDIR /usr/src/app


COPY --chown=node:node package*.json ./


RUN npm install

COPY --chown=node:node . .
RUN npm run tsc
USER node

EXPOSE 5000

CMD ["node", "index.js"]