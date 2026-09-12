# auth

Cloud Function CPF → JWT (auth cliente) — Tech Challenge FIAP ([fiap-vcosta](https://github.com/fiap-vcosta)).

Valida CPF via API (HTTPS + secret de serviço) e emite JWT de cliente com secret **separado** do JWT staff. Coexiste com o token opaco de aprovação na API.

## Stack

- **Runtime:** Node.js **22.23.2** — pin em [`.nvmrc`](.nvmrc)
- **Framework:** [Functions Framework](https://github.com/GoogleCloudPlatform/functions-framework-nodejs) (alvo Cloud Functions 2nd gen)
- **CI:** jobs separados de lint (summary error/warning) e testes unitários (summary de cobertura); sem deploy automático

## Decisões (ADRs)

Ver [`docs/README.md`](docs/README.md).

## Desenvolvimento local (scaffold)

```bash
nvm install   # se ainda não tiver o pin do .nvmrc
nvm use
npm ci
npm run lint
npm test
npm run test:coverage
npm start     # http://localhost:8081 — handler ainda retorna 501 (lógica na próxima entrega)
```

Variáveis de ambiente obrigatórias (validadas por `src/config.js`; uso completo no handler vem depois):

| Variável | Papel |
|----------|--------|
| `API_BASE_URL` | Base da API (ex. `http://localhost:8080`) |
| `JWT_CLIENTE_KEY` | Secret HS256 do JWT cliente (mesmo material que a API valida) |
| `JWT_CLIENTE_ISSUER` / `JWT_CLIENTE_AUDIENCE` | Claims alinhados à API (`tech-challenge-cliente`) |
| `SERVICE_AUTH_KEY` | Valor do header `X-Service-Key` na chamada à API |

Deploy GCP = **manual** (`workflow_dispatch`) — ainda não neste scaffold.

## Agentes

Ver [AGENTS.md](AGENTS.md).
