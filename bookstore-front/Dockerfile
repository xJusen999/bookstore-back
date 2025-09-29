# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app
ENV CI=true

# ---------- Deps (mejor cache) ----------
FROM base AS deps
# Si usas npm:
COPY package.json package-lock.json* ./
RUN npm ci



# ---------- Build ----------
FROM base AS build

COPY --from=deps /app/node_modules ./node_modules
COPY . .


ARG BACKEND_URL=http://127.0.0.1:8080
ENV BACKEND_URL=${BACKEND_URL}


RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app


RUN addgroup -g 1001 nodejs && adduser -S nextjs -u 1001

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000


COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static


ENV BACKEND_URL=${BACKEND_URL}

USER nextjs
CMD ["node", "server.js"]
