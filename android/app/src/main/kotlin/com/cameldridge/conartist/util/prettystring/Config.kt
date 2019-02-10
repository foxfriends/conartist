package com.cameldridge.conartist.util.prettystring

import com.cameldridge.conartist.R
import com.cameldridge.conartist.util.prettystring.Attribute.TextColor

final class Config(val base: List<Attribute>, val rules: List<Rule>) {
  companion object {
    var default: Config = Config(listOf(), listOf())
  }
}
