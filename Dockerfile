FROM node:lts-alpine as builder
WORKDIR /usr/src/temperature-api
COPY package*.json ./
RUN npm ci --prod
COPY . .
RUN npm run build

FROM node:lts-alpine
WORKDIR /usr/src/temperature-api
COPY --from=builder /usr/src/temperature-api ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
