package com.cameldridge.conartist.util.option

val <T> T?.asOption get(): Option<T> = if (this == null) { Option.None() } else { Option.Some(this) }
