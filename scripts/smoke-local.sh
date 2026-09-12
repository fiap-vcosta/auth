#!/usr/bin/env bash
# Smoke local: API Compose (:8080) + auth (:8081) → JWT cliente.
# Uso:
#   ./scripts/smoke-local.sh
#   ./scripts/smoke-local.sh 43372251034
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CPF="${1:-43372251034}"
AUTH_URL="${AUTH_URL:-http://localhost:8081}"

if [[ -f "${ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${ROOT}/.env"
  set +a
fi

echo "POST ${AUTH_URL}/  cpf=${CPF}" >&2
response="$(curl -sS -w "\n%{http_code}" -X POST "${AUTH_URL}/" \
  -H "Content-Type: application/json" \
  -d "{\"cpf\":\"${CPF}\"}")"

body="$(echo "${response}" | head -n -1)"
code="$(echo "${response}" | tail -n 1)"

if [[ "${code}" != "200" ]]; then
  echo "Falha HTTP ${code}: ${body}" >&2
  exit 1
fi

token="$(echo "${body}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d); if(!j.token) process.exit(2); process.stdout.write(j.token);})")"
echo "${token}"
echo "OK — cole o token em Authorization: Bearer … na API" >&2
