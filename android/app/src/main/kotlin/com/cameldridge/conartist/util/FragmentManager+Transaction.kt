package com.cameldridge.conartist.util

import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction

fun FragmentManager.transaction(block: FragmentTransaction.() -> Unit): Unit {
  val transaction = beginTransaction()
  transaction.block()
  transaction.commit()
}
