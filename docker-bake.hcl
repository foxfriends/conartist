group "default" {
    targets = ["conartist-migrate", "conartist-load", "conartist"]
}

target "image-metadata-action" {}
target "migrate-metadata-action" {}
target "load-metadata-action" {}

target "conartist" {
  inherits = ["image-metadata-action"]
  dockerfile = "Dockerfile"
  target = "release"
}

target "conartist-migrate" {
  inherits = ["migrate-metadata-action"]
  dockerfile = "Dockerfile"
  target = "migrate"
}

target "conartist-load" {
  inherits = ["load-metadata-action"]
  dockerfile = "Dockerfile"
  target = "load"
}
