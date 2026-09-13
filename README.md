# auth

Cloud Function CPF → JWT (auth cliente) — Tech Challenge FIAP ([fiap-vcosta](https://github.com/fiap-vcosta)).

Valida CPF via API (HTTPS + secret de serviço) e emite JWT de cliente com secret **separado** do JWT staff. Coexiste com o token opaco de aprovação na API.

## Stack

- **Runtime:** Node.js **22.23.2** — pin em [`.nvmrc`](.nvmrc)
- **Framework:** [Functions Framework](https://github.com/GoogleCloudPlatform/functions-framework-nodejs) **5.x** (alvo Cloud Functions 2nd gen)
- **CI:** jobs separados de lint (summary error/warning) e testes unitários (summary de cobertura); sem deploy automático

## Decisões (ADRs)

Ver [`docs/README.md`](docs/README.md).

## Contrato HTTP (local)

`POST /` com body `{ "documento": "92561324354" }` → `{ "token": "<JWT>" }`.

Aceita **CPF ou CNPJ** válidos (`cpf-cnpj-validator`). O JWT usa claim **`documento`** (contrato alinhado à API).

Erros de validação: `{ "errors": ["Documento inválido."] }`. Cliente inexistente: Problem Details **404**.

A Function chama `GET {API_BASE_URL}/api/system/clientes/por-documento/{documento}` com header `X-Service-Key`.

## Desenvolvimento local

### 1. API (repo `api`)

```bash
cd ../api
cp .env.example .env   # se ainda não tiver
docker compose --profile app up -d --build
curl -sS http://localhost:8080/health
```

Use os **mesmos** valores de `JWT_CLIENTE_*` e `SERVICE_AUTH_KEY` no `.env` deste repo.  
Cliente de teste local: documento **`92561324354`** (já cadastrado na sua API).

### 2. Auth

```bash
nvm use
cp .env.example .env
npm ci
npm run lint
npm test
npm run test:coverage
```

Subir a Function (escolha um):

```bash
npm start
# ou
docker compose up -d --build
```

### 3. Requestly (smoke HTTP)

Pasta: [`docs/requestly/`](docs/requestly/)

1. Importe `auth.requestly.json` (exploratória) e/ou `auth-e2e-tests.requestly.json`
2. Environment **Local** (`authUrl=http://localhost:8081`, `documento=92561324354`)
3. Rode `00-emitir-jwt / emitir-token` ou a pasta e2e no Collection Runner

- `.env.example` — modelo local (copiar para `.env`)
- `.env.test` — valores dummy dos testes
- `.env` — local, **não** versionado
- Auth em **`:8081`**; API em **`:8080`**
- No Docker, `API_BASE_URL` padrão é `http://host.docker.internal:8080`

| Variável | Papel |
|----------|--------|
| `API_BASE_URL` | Base da API |
| `JWT_CLIENTE_KEY` | Secret HS256 do JWT cliente (mesmo da API) |
| `JWT_CLIENTE_ISSUER` / `JWT_CLIENTE_AUDIENCE` | `tech-challenge-cliente` |
| `SERVICE_AUTH_KEY` | Header `X-Service-Key` |

JWT expira em **1800s** (hardcoded).

## Deploy na GCP

Deploy **manual** (`workflow_dispatch`) — merge em `main` **não** sobe a Function.

Pré-requisitos:

1. Apply do `infra-bootstrap` com APIs/roles de Function (CI SA `github-actions`)
2. Org vars (iguais às da `api`): `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT_EMAIL`
3. Repo secrets **idênticos** aos do `fiap-vcosta/api`:

| Secret | Papel |
|--------|--------|
| `JWT_CLIENTE_KEY` | Assinatura HS256 do JWT cliente |
| `SERVICE_AUTH_KEY` | Header `X-Service-Key` na chamada à API |

4. URL da API (LB HTTP agora; HTTPS nomeado depois):

| Fonte | Uso |
|-------|-----|
| Input `api_base_url` no Run workflow | Sobrescreve naquele run |
| Repo/org var `API_BASE_URL` | Default quando o input vem vazio |

Issuer/audience default: `tech-challenge-cliente` (override opcional via vars `JWT_CLIENTE_ISSUER` / `JWT_CLIENTE_AUDIENCE`).

```text
Actions → deploy → Run workflow → (opcional) colar API_BASE_URL → Run
```

A Function sobe como **2nd gen** (`nodejs22`), HTTP público (`--allow-unauthenticated`), entry-point `auth`. A URL HTTPS aparece no Job Summary.

Smoke rápido (documento seed da API):

```bash
curl -sS -X POST "$FUNCTION_URI" \
  -H 'content-type: application/json' \
  -d '{"documento":"92561324354"}'
```

A API na GCP precisa estar no ar para a Function validar o documento.

## Agentes

Ver [AGENTS.md](AGENTS.md).
