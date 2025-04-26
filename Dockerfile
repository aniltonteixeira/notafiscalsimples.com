# Usa imagem oficial do Node.js para build
FROM node:20 AS builder

# Define variáveis de ambiente como ARGs para o build
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Define as variáveis como ENV também (para o Next.js acessar no build)
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Instala dependências (pode ser pnpm, npm ou yarn)
RUN corepack enable && pnpm install --frozen-lockfile

# Faz o build do projeto
RUN pnpm build

# ---------------------------------------------------

# Usa uma imagem menor para produção
FROM node:20-slim AS runner

# Diretório de trabalho
WORKDIR /app

# Copia apenas o que é necessário da imagem anterior
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# De novo define as variáveis no runtime (importante pro container rodar)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NODE_ENV=production
ENV PORT=8080

# Expõe a porta padrão do Cloud Run
EXPOSE 8080

# Comando para iniciar o app
CMD ["npm", "start"]
