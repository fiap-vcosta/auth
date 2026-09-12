# Requestly — Function auth

Artefatos para exercitar a Function fora da suite Node (`npm test`).  
Espelham o padrão do repo [`api/docs/requestly/`](https://github.com/fiap-vcosta/api/tree/main/docs/requestly).

## Arquivos

| Arquivo | Uso |
|---------|-----|
| [`auth.requestly.json`](auth.requestly.json) | Collection **exploratória** |
| [`auth-e2e-tests.requestly.json`](auth-e2e-tests.requestly.json) | Suites **automatizadas** (Collection Runner) |
| [`environments/local.requestly.json`](environments/local.requestly.json) | Environment **Local** → auth `:8081` + API `:8080` |

### Environment

| Variável | Default | Papel |
|----------|---------|--------|
| `authUrl` | `http://localhost:8081` | Base da Function |
| `apiUrl` | `http://localhost:8080` | Base da API (contexto) |
| `cpf` | `92561324354` | CPF de cliente cadastrado na API local |
| `tokenCliente` | (secret) | Preenchido pelo `emitir-token` |

### Como importar

1. Suba a API: `cd ../api && docker compose --profile app up -d --build`
2. Suba o auth: `cp .env.example .env && npm start` (ou `docker compose up -d --build`)
3. Abra o [Requestly API Client](https://requestly.com/)
4. **Import → Requestly** (Collection & Environment)
5. Importe `auth.requestly.json` e/ou `auth-e2e-tests.requestly.json`
6. Selecione o environment **Local**
7. Exploratória: `00-emitir-jwt / emitir-token` → grava `tokenCliente`
8. E2E: pasta `01-emitir-jwt-cliente` → ⋯ → **Run**

Use o `tokenCliente` na collection da **api** (aprovar/rejeitar com Bearer).
