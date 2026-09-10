# ADR 002: Function → API via HTTPS e Secret de Serviço (sem VPC)

**Data:** 10 de Setembro de 2026  
**Status:** Aceito  
**Autores:** Victor Costa

## 1. Contexto e Problema

A Function de auth precisa saber se o CPF existe (e status útil) **antes** de emitir o JWT. Ela não deve falar com Postgres. Na GCP, dá para colocar a Function na VPC e alcançar a API por IP interno — ou chamar a API pela URL pública com autenticação de serviço.

O problema a ser resolvido é: **Como a Function consulta a API com segurança aceitável e custo/complexidade baixos para a demo?**

## 2. Decisão

**Opção B:** Function → API por **HTTPS público** + **autenticação de serviço**.

- Começar com **shared secret** no header (ex.: senha de serviço / API key interna) conhecido só pela Function e pela API.
- **Sem VPC Connector** / rede privada Function→API nesta fase.
- Evolução opcional depois: **ID token** da service account da Function (OIDC), se couber sem dor.
- A API expõe um endpoint de serviço “cliente por CPF” protegido por esse secret (não é rota anônima de internet aberta).

## 3. Justificativa

* **Custo:** VPC Connector + caminhos internos encarecem e complicam uma demo de minutos.
* **Padrão cloud moderno:** autenticar cada chamada (zero-trust light) em vez de confiar só na rede.
* **Shared secret** é o caminho mais curto para fechar o contrato; ID token SA é o passo “mais GCP nativo” se o tempo permitir.
* Alinhado à [ADR 001](001-auth-cpf-jwt-cliente.md): Function só precisa de JWT cliente + credencial de chamada à API.

## 4. Alternativas Consideradas

* **Opção A — VPC Connector → Internal LB / IP privado:** comum em enterprise; **evitada agora** por custo e operação.
* **Endpoint CPF totalmente aberto:** anti-padrão; enumeração de CPF e abuso.
* **Function → Cloud SQL direto:** acopla auth ao banco, fura a API como dona do domínio; rejeitado.
* **mTLS entre Function e API:** forte; setup pesado demais para a fase.

## 5. Consequências

### Positivas
* Implementação e debug simples (URL + header).
* Sem dependência de Connector na janela curta.
* Mesma URL pública da API (LB ou Gateway) serve staff, cliente e a Function.

### Negativas / Riscos (Mitigações)
* **Superfície pública:** o endpoint de serviço fica na borda HTTPS.
  * *Mitigação:* secret obrigatório; rate limit/WAF fora de escopo agora; não retornar dados além do necessário (existência/status).
* **Shared secret a rotacionar** e guardar no Secret Manager / secrets de deploy.
  * *Mitigação:* nunca no Git; evoluir para ID token SA reduz segredo de longa duração.
* **API precisa estar no ar** (ou URL de demo) para a Function autenticar CPFs.
  * *Mitigação:* ordem: contrato/endpoint na API → Function → rotas `/auth` no Gateway.
