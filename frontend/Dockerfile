# base image
FROM node:16-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile

# build image
FROM base AS build
COPY . .
RUN yarn build

# production image
FROM nginx:1.21-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]