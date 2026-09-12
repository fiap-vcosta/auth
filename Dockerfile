FROM node:22.23.2-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY scripts ./scripts
RUN npm ci --omit=dev

COPY src ./src

ENV PORT=8081
EXPOSE 8081

USER node

CMD ["node", "./node_modules/@google-cloud/functions-framework/build/src/main.js", "--target=auth", "--source=src", "--port=8081"]
