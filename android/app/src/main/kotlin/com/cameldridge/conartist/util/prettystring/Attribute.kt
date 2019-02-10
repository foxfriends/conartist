package com.cameldridge.conartist.util.prettystring

import android.text.style.ForegroundColorSpan
import androidx.annotation.ColorInt

sealed class Attribute {
  final data class TextColor(@ColorInt val color: Int): Attribute() {
    override val span = ForegroundColorSpan(color)
  }

  abstract val span: Any
}
