resource "google_cloud_run_v2_service" "auth" {
  name     = var.service_name
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = var.max_instance_count
    }

    timeout = var.timeout

    containers {
      image = var.image

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
      }

      env {
        name  = "API_BASE_URL"
        value = var.api_base_url
      }

      env {
        name  = "JWT_CLIENTE_KEY"
        value = var.jwt_cliente_key
      }

      env {
        name  = "JWT_CLIENTE_ISSUER"
        value = var.jwt_cliente_issuer
      }

      env {
        name  = "JWT_CLIENTE_AUDIENCE"
        value = var.jwt_cliente_audience
      }

      env {
        name  = "SERVICE_AUTH_KEY"
        value = var.service_auth_key
      }
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  project  = google_cloud_run_v2_service.auth.project
  location = google_cloud_run_v2_service.auth.location
  name     = google_cloud_run_v2_service.auth.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
