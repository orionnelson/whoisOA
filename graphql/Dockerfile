FROM node:latest

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install --frozen-lockfile

COPY . .

EXPOSE 5000

CMD ["node", "index.ts"]