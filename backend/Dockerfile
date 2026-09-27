# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
RUN apk add --no-cache tzdata
ENV TZ=America/Sao_Paulo
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Desenvolvimento: hot reload com o código montado via volume ----
FROM deps AS dev
COPY . .
EXPOSE 3000
# Compila, aplica migrations + seed e sobe em modo watch
CMD ["sh", "-c", "npm run build && npm run seed && npm run start:dev"]

# ---- Build de produção ----
FROM deps AS build
COPY . .
RUN npm run build && npm prune --omit=dev

FROM base AS prod
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
