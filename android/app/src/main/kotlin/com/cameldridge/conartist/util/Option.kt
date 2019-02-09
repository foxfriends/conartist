package com.cameldridge.conartist.util

val <T> T?.asOption get(): Option<T> = if (this == null) { Option.None() } else { Option.Some(this) }

sealed class Option<out T> {
  final class EmptyException(): Exception()

  final class Some<T>(val value: T): Option<T>()
  final class None<T>(): Option<T>()

  fun <U> map(transform: (T) -> U): Option<U> = when (this) {
    is Some -> Some(transform(value))
    is None -> None()
  }

  fun <U> flatMap(transform: (T) -> Option<U>): Option<U> = when (this) {
    is Some -> transform(value)
    is None -> None()
  }

  fun filter(predicate: (T) -> Boolean): Option<T> = when (this) {
    is Some -> if (predicate(value)) { Some(value) } else { None() }
    is None -> None()
  }

  fun unwrap(): T = when (this) {
    is Some -> value
    is None -> throw EmptyException()
  }
}
