data "docker_registry_image" "migrate" {
  name = local.migrate_image
}

resource "docker_image" "migrate" {
  name          = local.migrate_image
  pull_triggers = [data.docker_registry_image.migrate.sha256_digest]
}

resource "docker_container" "migrate" {
  image    = docker_image.migrate.image_id
  name     = "${var.name}-migrate"
  attach   = true
  must_run = false

  network_mode = "bridge"

  networks_advanced {
    name = docker_network.internal.name
  }

  env = [
    "DATABASE_URL=${local.database_url}",
  ]
}
