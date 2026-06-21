FROM node:20-bookworm-slim

WORKDIR /app/frontend/admin/server

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

ENV npm_config_build_from_source=true

COPY frontend/admin/server/package*.json ./
RUN npm ci --omit=dev --build-from-source=sqlite3

COPY frontend/admin/server/*.js ./
COPY frontend/admin/server/controllers ./controllers
COPY frontend/admin/server/migrations ./migrations
COPY frontend/admin/server/models ./models
COPY frontend/admin/server/requests ./requests
COPY frontend/admin/server/seeds ./seeds
COPY frontend/admin/server/services ./services

ENV NODE_ENV=production
ENV PORT=3001
ENV ADMIN_DB_PATH=/data/admin.db

EXPOSE 3001

CMD ["node", "docker-entrypoint.js"]
