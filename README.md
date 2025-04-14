# 🧾 Nota Fiscal Simples

Sistema completo para emissão de Notas Fiscais de Serviço Eletrônicas (NFS-e), com suporte à emissão individual e em lote, autenticação segura, gestão de múltiplas empresas e controle por planos.

## 🚀 Funcionalidades

- Autenticação com múltiplos níveis de acesso (administrador, usuário, contador)
- Cadastro e inativação de empresas
- Emissão de NFS-e com integração direta à prefeitura de Paulo Afonso (via SOAP)
- Emissão em lote e individual
- Geração automática de XML e PDF
- Dashboard de controle de notas emitidas
- Cancelamento de notas
- Sistema de planos com limites de usuários e empresas
- Fila de emissão para evitar duplicidade de RPS e Lote
- Proteção de rotas e cookies seguros (httpOnly)

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [Next.js 14](https://nextjs.org/)
- **Backend**: [Python (FastAPI)](https://fastapi.tiangolo.com/) com Worker para fila de notas
- **Banco de Dados**: [Supabase](https://supabase.io/) (PostgreSQL)
- **Infraestrutura**: Docker + Google Cloud Run
- **Autenticação**: Supabase Auth + Cookies assinados
- **Fila de processamento**: Pub/Sub (GCP) ou fila personalizada com worker assíncrono

## 📦 Como Rodar Localmente

### Pré-requisitos
- Node.js v18+
- Python 3.10+
- Docker
- pnpm (ou npm/yarn)

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/nota-fiscal-simples.git
cd nota-fiscal-simples
Fiz Teste6