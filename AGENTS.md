# Tech Challenge — Guia para agentes (`auth`)

Cloud Function (GCP) de autenticação de **cliente**: CPF → JWT. Parte da org [fiap-vcosta](https://github.com/fiap-vcosta); convive com a API .NET (`fiap-vcosta/api`).

## Antes de mudar código

1. Conferir ADRs em [`docs/adrs/`](docs/adrs/) (e requisitos da `api` quando o contrato HTTP for tocado)
2. Espelhar padrões das pastas vizinhas; não inventar estrutura paralela
3. Não inventar feature fora do contrato CPF → API → JWT já fechado nas ADRs
4. **Git:** nunca commit/push direto em `main` — branch → PR → merge (ver [`.cursor/rules/git-workflow.mdc`](.cursor/rules/git-workflow.mdc))

## Responsabilidade

| Peça | Papel |
|------|--------|
| Function HTTP | Valida CPF (via API com auth de serviço) e emite JWT cliente |
| Secrets | Só material JWT **cliente** + credencial de chamada à API |
| Fora de escopo | Login staff, GKE, Cloud SQL, token opaco (permanece na API) |

## Regras canônicas (resumo)

- Runtime: **Node.js 22** (`.nvmrc`) + Functions Framework; Cloud Functions 2nd gen
- Dois JWT secrets (staff na API × cliente aqui)
- Opção B: Function → API por HTTPS + secret de serviço; sem VPC
- Deploy caro = manual; merge em `main` não liga nuvem

## Layout

| Caminho | Papel |
|---------|--------|
| `src/index.js` | Registra o target HTTP `auth` no Functions Framework |
| `src/handler.js` | Handler HTTP (CPF → JWT) |
| `src/config.js` | Lê e valida env obrigatório |
| `test/` | Testes (`node --test`) |
| `.github/workflows/ci.yml` | lint + test |

## Comandos

```bash
nvm use
npm ci
npm run lint
npm test
npm start   # porta 8081
```
