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
  internal_port = 3000
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

  log_driver = var.log_driver
  log_opts   = var.log_opts

  dynamic "ports" {
    for_each = var.expose ? [var.port] : []

    content {
      internal = local.internal_port
      external = ports.value
    }
  }

  network_mode = "bridge"

  networks_advanced {
    name = docker_network.internal.name
  }

  networks_advanced {
    name = data.docker_network.bridge.name
  }

  dynamic "networks_advanced" {
    for_each = var.networks
    iterator = net

    content {
      name = net.value["name"]
    }
  }

  healthcheck {
    test         = ["CMD", "curl", "-f", "localhost:${local.internal_port}"]
    interval     = "1m"
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
    "PORT=${local.internal_port}",
  ]

  depends_on = [
    docker_container.migrate,
    docker_container.load,
  ]
}
