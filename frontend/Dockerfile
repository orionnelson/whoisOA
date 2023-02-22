# base image
FROM node:latest AS base
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN yarn install --frozen-lockfile

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