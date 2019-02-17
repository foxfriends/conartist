package com.cameldridge.conartist.util.prettystring

fun String.prettify(config: Config = Config.default) = PrettyString.parse(this, config)
