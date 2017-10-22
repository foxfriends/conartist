package com.cameldridge.conartist.schema

import android.os.Parcel
import android.os.Parcelable
import com.beust.klaxon.*
import java.util.*

data class Record(
    val products: ArrayList<Int>,
    val price: Double,
    val time: Date
): Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.createIntArray().toCollection(ArrayList()),
        parcel.readDouble(),
        Date(parcel.readLong())
    )

    companion object : GraphQLDeserializer<Record> {
        override fun deserialize(json: JsonObject): Record? {
            val products = json.array<Int>("products")?.let { ArrayList(it) } ?: return null
            val price = json.double("price") ?: return null
            val time = json.long("saleTime")?.let(::Date) ?: return null

            return Record(products, price, time)
        }

        @JvmField @Suppress("unused")
        val CREATOR = createParcel { Record(it) }
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeIntArray(products.toIntArray())
        parcel.writeDouble(price)
        parcel.writeLong(time.time)
    }

    override fun describeContents(): Int {
        return 0
    }
}