variable "project_id" {
  type        = string
  description = "GCP project ID da demo."
  default     = "vcosta-fiap-tech-challenge"
}

variable "region" {
  type        = string
  description = "Região do Cloud Run."
  default     = "us-central1"
}

variable "service_name" {
  type        = string
  description = "Nome do serviço Cloud Run."
  default     = "auth"
}

variable "image" {
  type        = string
  description = "Imagem completa no Artifact Registry (inclui tag)."
}

variable "api_base_url" {
  type        = string
  description = "URL pública da API consultada pela Function."
}

variable "jwt_cliente_key" {
  type        = string
  description = "Secret HS256 do JWT cliente (mesmo material da API)."
  sensitive   = true
}

variable "jwt_cliente_issuer" {
  type        = string
  description = "Issuer do JWT cliente."
  default     = "tech-challenge-cliente"
}

variable "jwt_cliente_audience" {
  type        = string
  description = "Audience do JWT cliente."
  default     = "tech-challenge-cliente"
}

variable "service_auth_key" {
  type        = string
  description = "Shared secret do header X-Service-Key."
  sensitive   = true
}

variable "memory" {
  type        = string
  description = "Limite de memória do container."
  default     = "256Mi"
}

variable "cpu" {
  type        = string
  description = "Limite de CPU do container."
  default     = "1"
}

variable "timeout" {
  type        = string
  description = "Timeout da requisição."
  default     = "60s"
}

variable "max_instance_count" {
  type        = number
  description = "Máximo de instâncias (custo da demo)."
  default     = 2
}
