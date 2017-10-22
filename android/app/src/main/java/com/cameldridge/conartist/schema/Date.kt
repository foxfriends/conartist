package com.cameldridge.conartist.schema

import android.annotation.SuppressLint
import java.text.SimpleDateFormat
import java.util.*

@SuppressLint("SimpleDateFormat")
private val dateParseFormat = SimpleDateFormat("yyyy-MM-dd")

fun parseDate(date: String): Date = dateParseFormat.parse(date)
fun formatDate(date: Date): String = dateParseFormat.format(date)

@SuppressLint("SimpleDateFormat")
private val datePrintFormat = SimpleDateFormat("MMM dd, YYYY")
fun formatDatePretty(date: Date): String = datePrintFormat.format(date)