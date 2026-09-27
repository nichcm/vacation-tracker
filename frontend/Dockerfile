# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Desenvolvimento: Vite com HMR, código montado via volume ----
FROM deps AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---- Build de produção ----
FROM deps AS build
COPY . .
RUN npm run build

# ---- Produção: nginx servindo o SPA e fazendo proxy de /api ----
FROM nginx:1.29-alpine AS prod
ENV API_UPSTREAM=http://backend:3000
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
