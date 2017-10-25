package com.cameldridge.conartist.parcel

import android.os.Parcel
import android.os.Parcelable

inline fun <reified T : Parcelable> createParcel(crossinline createFromParcel: (Parcel) -> T?): Parcelable.Creator<T> =
    object : Parcelable.Creator<T> {
        override fun createFromParcel(source: Parcel): T? = createFromParcel(source)
        override fun newArray(size: Int): Array<out T?> = arrayOfNulls(size)
    }

fun Parcel.writeBool(v: Boolean) = this.writeInt(if(v) { 1 } else { 0 })
fun Parcel.readBool() = this.readInt() != 0