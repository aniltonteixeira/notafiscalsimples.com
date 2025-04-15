# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Garante que o NEXT_PUBLIC_... e outras variáveis estejam disponíveis no build
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

RUN npm run build

# Etapa 2: Produção
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./
RUN npm install --production

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
# Teste
