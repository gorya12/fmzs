FROM node:20-bookworm-slim

WORKDIR /app/frontend/admin/server

COPY frontend/admin/server/package*.json ./
RUN npm ci --omit=dev

COPY frontend/admin/server ./

ENV NODE_ENV=production
ENV PORT=3001
ENV ADMIN_DB_PATH=/data/admin.db

EXPOSE 3001

CMD ["node", "docker-entrypoint.js"]
