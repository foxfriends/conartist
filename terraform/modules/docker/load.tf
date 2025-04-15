data "docker_registry_image" "load" {
  name = local.load_image
}

resource "docker_image" "load" {
  name          = local.load_image
  pull_triggers = [data.docker_registry_image.load.sha256_digest]
}

resource "docker_container" "load" {
  count = var.conventions_dir != null ? 1 : 0

  image    = docker_image.load.image_id
  name     = "${var.name}-load"
  attach   = true
  must_run = false

  network_mode = "bridge"

  networks_advanced {
    name = docker_network.internal.name
  }

  volumes {
    container_path = "/conventions"
    host_path      = var.conventions_dir
    read_only      = false
  }

  env = [
    "DATABASE_URL=${local.database_url}",
    "SAVE_IDS=true",
  ]

  depends_on = [docker_container.migrate]
}
