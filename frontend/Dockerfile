# base image
FROM node:latest AS base
USER node
WORKDIR /usr/src/app
RUN sudo chown -R node:node /usr/src/app
COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./
RUN yarn install

# build image
FROM base AS build
COPY --chown=node:node . .
USER node
CMD ["yarn", "start"]

# production image
#FROM nginx:latest AS production
#COPY --from=build /app/build /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]