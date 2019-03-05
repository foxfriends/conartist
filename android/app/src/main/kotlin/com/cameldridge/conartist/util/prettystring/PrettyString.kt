package com.cameldridge.conartist.util.prettystring

import android.text.SpannableStringBuilder
import android.text.Spanned
import android.text.SpannedString
import com.cameldridge.conartist.util.prettystring.PrettyString.Companion.State.Close
import com.cameldridge.conartist.util.prettystring.PrettyString.Companion.State.DoubleOpen
import com.cameldridge.conartist.util.prettystring.PrettyString.Companion.State.Open
import com.cameldridge.conartist.util.prettystring.PrettyString.Companion.State.OpenClose
import com.cameldridge.conartist.util.prettystring.PrettyString.Companion.State.Start

final class PrettyString(
  val raw: String,
  val config: Config
) {

  companion object {
    final class MissingNameException(): Exception()
    final class IncompleteTokenException(): Exception()
    final class UndefinedNameExcpetion(): Exception()
    final class UnclosedAnnotationException(): Exception()

    sealed class State {
      final object Start: State()
      final data class Open(val name: String): State()
      final object DoubleOpen: State()
      final object Close: State()
      final object OpenClose: State()
    }

    sealed class Token {
      final data class Open(val name: String): Token()
      final data class Text(val text: String): Token()
      final object Close: Token()
    }

    private tailrec fun lmm(text: String, state: State = State.Start): Pair<Token, String> {
      val first = text.firstOrNull()
      val rest = text.drop(1)
      return when {
        state is Start && first == '{' -> lmm(rest, Open(""))
        state is Start && first == '}' -> lmm(rest, Close)
        state is Start && first != null -> Pair(Token.Text(first.toString()), rest)
        state is Open && state.name.isEmpty() && first == '{' -> lmm(rest, DoubleOpen)
        state is Open && state.name.isEmpty() && first == '}' -> lmm(rest, OpenClose)
        state is Open && state.name.isEmpty() && first == ':' -> throw MissingNameException()
        state is Open && first == ':' -> Pair(Token.Open(state.name), rest)
        state is Open && first != null -> lmm(rest, Open(state.name + first))
        state is Close -> Pair(Token.Close, text)
        state is DoubleOpen -> Pair(Token.Text("{"), text)
        state is OpenClose -> Pair(Token.Text("}"), text)
        else -> throw IncompleteTokenException()
      }
    }

    private fun tokenize(raw: String): List<Token> {
      var string = raw
      val tokens: MutableList<Token> = mutableListOf()
      while (!string.isEmpty()) {
        val (token, rest) = lmm(string)
        tokens.add(token)
        string = rest
      }
      return tokens
    }

    private fun compile(attributes: List<List<Attribute>>) =
      attributes
        .flatMap { it.map { it.span } }

    fun parse(string: String, config: Config): SpannedString {
      val tokens = tokenize(string)

      val output = SpannableStringBuilder()
      val attributes = mutableListOf(config.base)
      var segment = ""

      for (token in tokens) {
        when (token) {
          is Token.Text -> segment += token.text
          is Token.Open -> {
            if (!segment.isEmpty()) {
              val start = output.length
              val end = start + segment.length
              output.append(segment)
              for (span in compile(attributes)) {
                output.setSpan(span, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
              }
              segment = ""
            }
            val rule = config.rules.find { it.name == token.name } ?: throw UndefinedNameExcpetion()
            attributes.add(rule.attributes)
          }
          is Token.Close -> {
            if (!segment.isEmpty()) {
              val start = output.length
              val end = start + segment.length
              output.append(segment)
              for (span in compile(attributes)) {
                output.setSpan(span, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
              }
              segment = ""
            }
            if (attributes.isEmpty()) {
              throw UnclosedAnnotationException()
            }
            attributes.removeAt(attributes.size - 1)
          }
        }
      }

      if (!segment.isEmpty()) {
        val start = output.length
        val end = start + segment.length
        output.append(segment)
        for (span in compile(attributes)) {
          output.setSpan(span, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        }
      }

      if (attributes.size != 1) {
        throw UnclosedAnnotationException()
      }

      return SpannedString(output)
    }
  }
}
