terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.2"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.7.1"
    }
  }
}

locals {
  image         = "${var.image_name}:${var.image_version}"
  load_image    = "${var.load_image_name}:${var.image_version}"
  migrate_image = "${var.migrate_image_name}:${var.image_version}"
  database_name = "conartist"
  database_user = "conartist"
  database_url  = "postgresql://${local.database_user}:${random_password.postgres_password.result}@postgres:5432/${local.database_name}"
}

data "docker_registry_image" "conartist" {
  name = local.image
}

resource "docker_image" "conartist" {
  name          = local.image
  pull_triggers = [data.docker_registry_image.conartist.sha256_digest]
}

resource "random_bytes" "jwt_secret" {
  length = 128
}

resource "docker_container" "conartist" {
  image   = docker_image.conartist.image_id
  name    = var.name
  restart = var.restart

  ports {
    internal = 3000
  }

  network_mode = "bridge"

  networks_advanced {
    name = docker_network.internal.name
  }

  networks_advanced {
    name = data.docker_network.bridge.name
  }

  healthcheck {
    test         = ["CMD", "curl", "-f", "localhost:3000"]
    interval     = "5s"
    retries      = 2
    start_period = "1s"
    timeout      = "500ms"
  }

  env = [
    "JWT_SECRET=${random_bytes.jwt_secret.hex}",
    "DATABASE_URL=${local.database_url}",
    "CONARTIST_BASE_URL=${var.base_url}",
    "CONARTIST_SERVER_EMAIL=${var.server_email}",
    "MAILGUN_USERNAME=${var.mailgun_username}",
    "MAILGUN_PASSWORD=${var.mailgun_password}",
    "MAILGUN_API_KEY=${var.mailgun_api_key}",
    "RUST_LOG=server,logger",
    "PORT=3000",
  ]

  depends_on = [
    docker_container.migrate,
    docker_container.load,
  ]
}
