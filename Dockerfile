# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS base
WORKDIR /app

# Install only production deps in a separate layer
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

FROM base AS runtime
ENV NODE_ENV=production
USER node
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||4000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "index.js"]


