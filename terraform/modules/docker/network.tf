resource "docker_network" "internal" {
  name     = "${var.name}-internal"
  driver   = "bridge"
  internal = true
}

data "docker_network" "bridge" {
  name = "bridge"
}
