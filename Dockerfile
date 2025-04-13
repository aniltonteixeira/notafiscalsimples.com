# Etapa 1: build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia só o necessário primeiro (melhora cache do Docker)
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Agora copia o restante do código
COPY . .

# Gera os arquivos de produção
RUN pnpm build

# Etapa 2: produção
FROM node:18-alpine

WORKDIR /app

# Habilita pnpm na imagem final (recomendado para rodar "pnpm start")
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copia apenas os arquivos necessários para produção
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 8080

CMD ["pnpm", "start"]
