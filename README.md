# Controle de Férias — MVP

MVP de acompanhamento de férias:

- **Login** (JWT)
- **Solicitar férias** — escolha de data de início e fim num calendário + histórico das próprias solicitações
- **Aprovações** (gestor) — aprovar ou recusar (com motivo opcional) os pedidos pendentes
- **Quem está de férias** — férias aprovadas do mês, com linha do tempo e navegação entre meses

| Camada   | Stack |
|----------|-------|
| Backend  | Node.js 24, TypeScript, NestJS 12, TypeORM, PostgreSQL 16, Vitest |
| Frontend | React 19, Vite, Tailwind CSS 4, shadcn/ui, Lucide React, TanStack Query, React Router |
| Infra    | Docker / Docker Compose |

## Estrutura

```
vacation-tracker/
├─ docker-compose.yml      # ambiente completo: postgres + backend + frontend
├─ backend/                # API NestJS (Vertical Slice Architecture)
│  ├─ docker-compose.yml   # backend isolado: postgres + API
│  └─ Dockerfile           # targets: dev | prod
└─ frontend/               # SPA React
   ├─ docker-compose.yml   # frontend isolado (usa a API do host na porta 3000)
   └─ Dockerfile           # targets: dev | prod (nginx)
```

## Como rodar

### Tudo junto (recomendado)

```bash
docker compose up --build
```

- Web: http://localhost:5173
- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs

O container do backend compila, aplica as migrations, roda o seed e sobe em modo watch.
O `backend/src` e o `frontend/` são montados via volume, então alterações de código recarregam automaticamente.
Ao mudar dependências ou configurações do backend (`package.json`, `tsconfig.json`), rode `docker compose up --build`.

### Cada projeto separado

```bash
# Terminal 1 – API + banco
cd backend && docker compose up --build

# Terminal 2 – web (encaminha /api para host.docker.internal:3000)
cd frontend && docker compose up --build
```

> Não rode o compose da raiz e os individuais ao mesmo tempo: eles usam as mesmas portas (5432, 3000, 5173).

### Sem Docker (Node 24+)

```bash
cd backend && cp .env.example .env && npm install
npm run build && npm run seed && npm run start:dev   # precisa de um PostgreSQL acessível

cd frontend && cp .env.example .env && npm install && npm run dev
```

## Usuários de teste (seed)

Todos com a senha `ferias123` (definida em [backend/src/seed/seed.ts](backend/src/seed/seed.ts)):

| E-mail | Papel |
|---|---|
| gestor@empresa.com | Gestor |
| ana@empresa.com | Colaborador |
| bruno@empresa.com | Colaborador |
| carla@empresa.com | Colaborador |

O seed é idempotente e cria também algumas solicitações de exemplo no mês atual/próximo (apenas se a tabela estiver vazia).
Para zerar o banco: `docker compose down -v`.

## Backend — Vertical Slice Architecture

Cada caso de uso é uma *slice* autocontida (controller + handler + DTOs + módulo). Não existem camadas
horizontais globais de "services/repositories"; só a infraestrutura transversal fica em `shared/`.

```
backend/src/
├─ shared/                    # infraestrutura transversal
│  ├─ auth/                   # JWT global (@Public libera), @Roles, @CurrentUser
│  ├─ database/               # configuração TypeORM / DataSource
│  ├─ entities/               # User, VacationRequest
│  ├─ clock/  dates/          # relógio injetável e utilitários de datas AAAA-MM-DD
├─ features/
│  ├─ auth/login/             POST  /api/auth/login
│  ├─ auth/get-me/            GET   /api/auth/me
│  └─ vacations/
│     ├─ request-vacation/    POST  /api/vacations              { startDate, endDate }
│     ├─ list-my-vacations/   GET   /api/vacations/mine
│     ├─ list-pending/        GET   /api/vacations/pending           (gestor)
│     ├─ approve-vacation/    PATCH /api/vacations/:id/approve       (gestor)
│     ├─ reject-vacation/     PATCH /api/vacations/:id/reject {reason?} (gestor)
│     └─ list-monthly/        GET   /api/vacations/monthly?month=AAAA-MM
├─ migrations/
└─ seed/
```

Para adicionar uma funcionalidade, crie uma nova pasta em `features/<contexto>/<caso-de-uso>/` e registre o módulo em `app.module.ts`.

### Regras de negócio

- A data de fim deve ser igual ou posterior à de início; a de início não pode estar no passado.
- Não é permitido sobrepor uma solicitação pendente ou aprovada do mesmo colaborador (HTTP 409).
- Somente solicitações pendentes podem ser aprovadas/recusadas; o gestor não decide as próprias.
- "Quem está de férias" lista apenas férias **aprovadas** que tocam algum dia do mês.

### Scripts úteis (backend)

```bash
npm test               # testes unitários dos handlers (Vitest)
npm run lint           # oxlint
npm run migration:run  # aplica migrations (após npm run build)
```

## Frontend

Também organizado por funcionalidade:

```
frontend/src/
├─ components/ui/             # componentes shadcn/ui
├─ components/layout/         # cabeçalho e navegação
├─ lib/api.ts                 # fetch com token JWT; chama /api (proxy do Vite/nginx)
└─ features/
   ├─ auth/                   # login, contexto de autenticação, rotas protegidas
   └─ vacations/
      ├─ request/             # /ferias/solicitar
      ├─ approvals/           # /ferias/aprovacoes (gestor)
      ├─ monthly/             # /ferias/mes
      └─ shared/              # tipos, badge de status, datas
```

O frontend sempre chama `/api/...`; em dev o Vite faz proxy para `VITE_API_PROXY_TARGET`
e em produção o nginx faz proxy para `API_UPSTREAM`, então não há configuração de CORS no navegador.
