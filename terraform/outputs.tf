output "service_uri" {
  description = "URL HTTPS pública do auth."
  value       = google_cloud_run_v2_service.auth.uri
}

output "service_name" {
  description = "Nome do serviço Cloud Run."
  value       = google_cloud_run_v2_service.auth.name
}

output "image" {
  description = "Imagem aplicada."
  value       = var.image
}
