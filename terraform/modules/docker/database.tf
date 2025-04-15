resource "random_password" "postgres_password" {
  length  = 32
  special = false
}

resource "docker_image" "postgres" {
  name = "postgres:17.4"
}

resource "docker_volume" "postgres_data" {
  name = "${var.name}-pgdata"

  lifecycle {
    prevent_destroy = true
  }
}

resource "docker_container" "postgres" {
  image   = docker_image.postgres.image_id
  name    = "${var.name}-postgres"
  wait    = true
  restart = var.restart

  volumes {
    container_path = "/var/lib/postgresql/data"
    volume_name    = docker_volume.postgres_data.name
    read_only      = false
  }

  network_mode = "bridge"

  networks_advanced {
    name    = docker_network.internal.name
    aliases = ["postgres"]
  }

  healthcheck {
    test     = ["CMD-SHELL", "pg_isready -U ${local.database_user}"]
    interval = "2s"
    timeout  = "5s"
    retries  = 5
  }

  env = [
    "POSTGRES_USER=${local.database_user}",
    "POSTGRES_DB=${local.database_name}",
    "POSTGRES_PASSWORD=${random_password.postgres_password.result}",
  ]
}
