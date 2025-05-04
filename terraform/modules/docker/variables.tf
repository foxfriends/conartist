# Common variables
variable "name" {
  type = string
}

variable "expose" {
  type    = bool
  default = true
}

variable "port" {
  type     = number
  nullable = true
  default  = null
}

variable "networks" {
  type = list(object({
    name = string
  }))
  default = []
}

variable "restart" {
  type    = string
  default = "unless-stopped"
}

variable "log_driver" {
  type    = string
  default = "local"
}

variable "log_opts" {
  type    = map(string)
  default = {}
}

# Default variables
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

# Config variables
variable "conventions_dir" {
  type     = string
  nullable = true
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
