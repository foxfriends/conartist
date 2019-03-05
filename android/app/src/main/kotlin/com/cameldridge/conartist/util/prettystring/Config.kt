package com.cameldridge.conartist.util.prettystring

final class Config(val base: List<Attribute>, val rules: List<Rule>) {
  companion object {
    var default: Config = Config(listOf(), listOf())
  }
}
