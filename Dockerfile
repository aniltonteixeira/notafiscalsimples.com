# Etapa 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install
RUN pnpm build

# Etapa 2: Produção
FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "start"]
