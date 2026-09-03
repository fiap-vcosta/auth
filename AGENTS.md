# Tech Challenge — Guia para agentes (`auth`)

Cloud Function (GCP) de autenticação de **cliente**: CPF → JWT. Parte da org [fiap-vcosta](https://github.com/fiap-vcosta); convive com a API .NET (`fiap-vcosta/api`).

## Antes de mudar código

1. Conferir decisões de auth no checklist local da Fase 03 / ADRs deste repo (quando existirem)
2. Espelhar padrões das pastas vizinhas; não inventar estrutura paralela
3. Não implementar feature futura sem decisão fechada (runtime, contrato HTTP, secrets)
4. **Git:** nunca commit/push direto em `main` — branch → PR → merge (ver [`.cursor/rules/git-workflow.mdc`](.cursor/rules/git-workflow.mdc))

## Responsabilidade

| Peça | Papel |
|------|--------|
| Function HTTP | Valida CPF (via API com auth de serviço) e emite JWT cliente |
| Secrets | Só material JWT **cliente** + credencial de chamada à API |
| Fora de escopo | Login staff, GKE, Cloud SQL, token opaco (permanece na API) |

## Regras canônicas (resumo)

- Dois JWT secrets (staff na API × cliente aqui)
- Opção B: Function → API por HTTPS + secret de serviço; sem VPC
- Deploy caro = manual; merge em `main` não liga nuvem

## Comandos

Definir após o scaffold (runtime escolhido na execução). Preferir scripts/`Makefile` documentados no README.
