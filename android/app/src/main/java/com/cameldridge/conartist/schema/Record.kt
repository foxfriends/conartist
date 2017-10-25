package com.cameldridge.conartist.schema

import android.os.Parcel
import android.os.Parcelable
import com.beust.klaxon.JsonObject
import com.beust.klaxon.array
import com.beust.klaxon.double
import com.beust.klaxon.long
import com.cameldridge.conartist.parcel.createParcel
import com.cameldridge.conartist.parcel.readBool
import com.cameldridge.conartist.parcel.writeBool
import java.util.*

data class Record(
    val products: ArrayList<Int>,
    val price: Double,
    val time: Date
): Parcelable {
    var dirty = false

    constructor(parcel: Parcel) : this(
        parcel.createIntArray().toCollection(ArrayList()),
        parcel.readDouble(),
        Date(parcel.readLong())
    ) {
        dirty = parcel.readBool()
    }

    companion object : GraphQLDeserializer<Record> {
        override fun deserialize(json: JsonObject): Record? {
            val products = json.array<Int>("products")?.let { ArrayList(it) } ?: return null
            val price = json.double("price") ?: return null
            val time = json.long("time")?.let(::Date) ?: return null

            return Record(products, price, time)
        }

        @JvmField @Suppress("unused")
        val CREATOR = createParcel { Record(it) }
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeIntArray(products.toIntArray())
        parcel.writeDouble(price)
        parcel.writeLong(time.time)
        parcel.writeBool(dirty)
    }

    override fun describeContents(): Int {
        return 0
    }
}