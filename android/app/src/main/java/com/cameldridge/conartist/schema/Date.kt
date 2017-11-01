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

@SuppressLint("SimpleDateFormat")
private val timeParseFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
fun parseTime(date: String): Date = timeParseFormat.parse(date)
fun formatTime(date: Date): String = timeParseFormat.format(date)

@SuppressLint("SimpleDateFormat")
private val timePrintFormat = SimpleDateFormat("EEE, h:mm a")
fun formatTimePretty(date: Date): String = timePrintFormat.format(date)