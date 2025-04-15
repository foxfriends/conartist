variable "name" {
  type = string
}

variable "image_name" {
  type    = string
  default = "ghcr.io/foxfriends/conartist"
}

variable "migrate_image_name" {
  type    = string
  default = "ghcr.io/foxfriends/conartist-migrate"
}

variable "load_image_name" {
  type    = string
  default = "ghcr.io/foxfriends/conartist-load"
}

variable "image_version" {
  type    = string
  default = "main"
}

variable "bridge_network_name" {
  type    = string
  default = "bridge"
}

variable "conventions_dir" {
  type     = string
  nullable = true
}

variable "restart" {
  type    = string
  default = "unless-stopped"
}
