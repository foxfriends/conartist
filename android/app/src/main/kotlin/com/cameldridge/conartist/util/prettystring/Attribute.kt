package com.cameldridge.conartist.util.prettystring

import android.text.style.ForegroundColorSpan
import android.text.style.StyleSpan
import androidx.annotation.ColorInt

sealed class Attribute {
  final data class TextColor(@ColorInt val color: Int): Attribute() {
    override val span = ForegroundColorSpan(color)
  }

  final data class TextStyle(val style: Int): Attribute() {
    override val span = StyleSpan(style)
  }

  abstract val span: Any
}
