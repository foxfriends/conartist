package com.cameldridge.conartist.schema

import android.os.Parcel
import android.os.Parcelable
import com.beust.klaxon.*
import com.cameldridge.conartist.parcel.createParcel
import java.util.*

data class Expense(
    val price: Double,
    val category: String,
    val description: String,
    val spendTime: Date
): Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readDouble(),
        parcel.readString(),
        parcel.readString(),
        Date(parcel.readLong())
    )

    companion object: GraphQLDeserializer<Expense> {
        override fun deserialize(json: JsonObject): Expense? {
            val price = json.double("price") ?: return null
            val category = json.string("category") ?: return null
            val description = json.string("description") ?: return null
            val spendTime = json.long("spendTime")?.let(::Date) ?: return null

            return Expense(price, category, description, spendTime)
        }

        @JvmField @Suppress("unused")
        val CREATOR = createParcel { Expense(it) }
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeDouble(price)
        parcel.writeString(category)
        parcel.writeString(description)
        parcel.writeLong(spendTime.time)
    }

    override fun describeContents(): Int {
        return 0
    }
}