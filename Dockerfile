FROM node:lts-alpine as builder
WORKDIR /usr/src/temperature-api
COPY package*.json ./
RUN npm install
#RUN echo "export default { key = 'xxxxxxxxxxxxxxxxxxxxxxxx' }" >> src/config/api-key.ts
COPY . .
RUN npm run build

FROM node:lts-alpine
WORKDIR /usr/src/temperature-api
COPY --from=builder /usr/src/temperature-api ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
