package com.cameldridge.conartist.schema

import java.util.*
import kotlin.collections.ArrayList

interface Convention

data class MetaConvention(
    val conId: Int,
    val code: String,
    val start: Date,
    val end: Date
): Convention {
    override fun equals(other: Any?): Boolean {
        return when(other) {
            is MetaConvention -> other.conId == conId
            else -> false
        }
    }

    override fun hashCode(): Int {
        return code.hashCode()
    }
}

data class FullConvention(
    val conId: Int,
    val code: String,
    val start: Date,
    val end: Date,
    val productTypes: ArrayList<Unit>,
    val products: ArrayList<Unit>,
    val prices: ArrayList<Unit>,
    val records: ArrayList<Unit>,
    val expenses: ArrayList<Unit>
): Convention {
    override fun equals(other: Any?): Boolean {
        return when(other) {
            is FullConvention -> other.conId == conId
            else -> false
        }
    }

    override fun hashCode(): Int {
        return code.hashCode()
    }
}
