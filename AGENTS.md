# Tech Challenge — Guia para agentes (`auth`)

Cloud Function (GCP) de autenticação de **cliente**: documento (CPF/CNPJ) → JWT. Parte da org [fiap-vcosta](https://github.com/fiap-vcosta); convive com a API .NET (`fiap-vcosta/api`).

## Antes de mudar código

1. Conferir ADRs em [`docs/adrs/`](docs/adrs/) (e requisitos da `api` quando o contrato HTTP for tocado)
2. Espelhar padrões das pastas vizinhas; não inventar estrutura paralela
3. Não inventar feature fora do contrato documento → API → JWT já fechado nas ADRs
4. **Git:** nunca commit/push direto em `main` — branch → PR → merge (ver [`.cursor/rules/git-workflow.mdc`](.cursor/rules/git-workflow.mdc))

## Responsabilidade

| Peça | Papel |
|------|--------|
| Function HTTP | Valida documento (via API com auth de serviço) e emite JWT cliente |
| Secrets | Só material JWT **cliente** + credencial de chamada à API |
| Fora de escopo | Login staff, GKE, Cloud SQL, token opaco (permanece na API) |

## Regras canônicas (resumo)

- Runtime: **Node.js 22.23.2** (`.nvmrc`) + Functions Framework; Cloud Functions 2nd gen
- Mensagens de erro / logs voltados ao usuário: **pt-BR**
- Body: só `documento` (CPF ou CNPJ); claim JWT `documento` (alinhado à API)
- Respostas: `{ errors }` na validação; Problem Details nos demais erros
- Opção B: Function → API por HTTPS + secret de serviço; sem VPC
- Deploy: merge → `build-push`; subir/descer nuvem = `tf-apply` / `tf-destroy` manuais (Cloud Run no state prefix `auth`)
- Secrets de apply: mesmos `JWT_CLIENTE_KEY` / `SERVICE_AUTH_KEY` da `api` via `TF_VAR_*`; `API_BASE_URL` via input ou var
- Local: API Compose `:8080` + auth `:8081`; mesmos `JWT_CLIENTE_*` / `SERVICE_AUTH_KEY`

## Layout

| Caminho | Papel |
|---------|--------|
| `src/domain/` | Documento (normalizar/validar) |
| `src/application/` | Caso de uso emitir token |
| `src/infrastructure/` | Config, gateway API, JWT, HTTP responses |
| `src/presentation/` | Handler HTTP |
| `src/index.js` | Entry Functions Framework |
| `docker-compose.yml` / `Dockerfile` | Ambiente local na porta 8081 |
| `docs/requestly/` | Collections Requestly |
| `test/` | Testes espelhando `src/` |

## Comandos

```bash
nvm use
cp .env.example .env
npm ci
npm run lint
npm test
npm run test:coverage
npm start                    # :8081
docker compose up -d --build # alternativa
```

Smoke HTTP: importar [`docs/requestly/`](docs/requestly/) no Requestly (documento `92561324354`).
