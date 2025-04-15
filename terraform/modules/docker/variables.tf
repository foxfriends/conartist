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

variable "base_url" {
  type = string
}

variable "server_email" {
  type = string
}

variable "mailgun_username" {
  type     = string
  nullable = true
  default  = null
}

variable "mailgun_password" {
  type      = string
  nullable  = true
  default   = null
  sensitive = true
}

variable "mailgun_api_key" {
  type      = string
  nullable  = true
  default   = null
  sensitive = true
}
