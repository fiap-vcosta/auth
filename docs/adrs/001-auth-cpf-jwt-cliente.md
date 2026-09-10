# ADR 001: Auth Cliente por CPF (JWT) e Coexistência com Staff

**Data:** 10 de Setembro de 2026  
**Status:** Aceito  
**Autores:** Victor Costa

## 1. Contexto e Problema

A oficina já autentica **staff** (Admin / Atendente / Mecânico) com login/senha → JWT na API. O cliente aprova/rejeita orçamento localizando a OS por **token opaco**. O enunciado da evolução pede autenticação do cliente por **CPF**, sem abrir área nova de autoatendimento e sem remover o token opaco.

O problema a ser resolvido é: **Como emitir identidade de cliente (CPF) sem misturar com o JWT de staff e sem abandonar o fluxo atual de aprovação?**

## 2. Decisão

- **Emissor cliente:** este repo — **Cloud Function** HTTP: recebe CPF → valida existência/status via API → emite **JWT de cliente**.
- **Emissor staff:** permanece na **API** (`login`/`senha` → JWT staff).
- **Dois secrets JWT:** `JWT_CLIENT_SECRET` (só a Function conhece para assinar; a API valida) **separado** do secret staff (só a API). A Function **nunca** recebe o secret admin.
- **Token opaco (`TokenAprovacao`):** **mantido** — continua localizando a OS.
- **Rotas de aprovação/rejeição:** passam a exigir **JWT cliente + token opaco**; escopo funcional igual (aprovar/rejeitar orçamento). Ownership: CPF do JWT deve ser o do cliente dono da OS; senão negar (403/404), sem vazar dados de outro cliente.
- **Fora de escopo aqui:** login staff, consulta ampla de OS para cliente (salvo se o professor exigir depois), VPC/SQL direto.

## 3. Justificativa

* **Dois emissores → dois secrets:** se a Function vazasse um secret único compartilhado com admin, o atacante mintaria JWT Admin. Com secret só de cliente, o blast radius fica no papel cliente.
* **JWT por cima do opaco:** identidade (quem é) + capability (qual OS); o opaco sozinho era anônimo demais para o novo requisito.
* **Function dedicada:** casa com “Lambda” do enunciado, escala a zero fora da demo, e isola o material de assinatura cliente.
* **Mesmos use cases na API:** não duplicar regra de aprovação na borda.

## 4. Alternativas Consideradas

* **Um único JWT secret para staff e cliente:** mais simples; **rejeitado** pelo risco de privilege escalation se a Function vazar.
* **Só CPF sem JWT** (API confia no body): frágil e forja fácil.
* **Substituir token opaco por só JWT:** perderia o localizador opaco já modelado; fora da decisão fechada.
* **IdP externo (Cognito/Auth0):** padrão indústria; overkill de custo/setup para a demo.
* **Cloud Run em vez de Functions:** viável; Functions alinhadas ao enunciado e ao default da fase.

## 5. Consequências

### Positivas
* Staff e cliente não compartilham material de chave.
* Contrato claro para a API evoluir RF21 (JWT + opaco + ownership).
* Function pode ser destruída/recriada na janela sem tocar no secret staff.

### Negativas / Riscos (Mitigações)
* **Dois pipelines de auth** para integrar e testar (A≠B ownership).
  * *Mitigação:* testes obrigatórios na API; collections Requestly atualizadas.
* **Runtime da Function** (Node vs Python) ainda na execução.
  * *Mitigação:* escolher no scaffold; ADR de produto não depende da linguagem.
* **Paths HTTP exatos** (`/auth/...`) na execução + Gateway.
  * *Mitigação:* documentar no README deste repo e no Swagger da API quando fecharem.
