FROM node:22.23.2-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV PORT=8080
EXPOSE 8080

USER node

CMD ["node", "./node_modules/@google-cloud/functions-framework/build/src/main.js", "--target=auth", "--source=src"]
