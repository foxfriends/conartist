package com.cameldridge.conartist.schema

import android.os.Parcel
import android.os.Parcelable
import com.beust.klaxon.JsonObject
import com.beust.klaxon.array
import com.beust.klaxon.double
import com.beust.klaxon.int

data class PricePair(val quantity: Int, val price: Double): Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readInt(),
        parcel.readDouble()) {
    }

    companion object: GraphQLDeserializer<PricePair> {
        override fun deserialize(json: JsonObject): PricePair? {
            val quantity = json.int("quantity") ?: return null
            val price = json.double("price") ?: return null

            return PricePair(quantity, price)
        }

        @JvmField @Suppress("unused")
        val CREATOR = createParcel { PricePair(it) }
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeInt(quantity)
        parcel.writeDouble(price)
    }

    override fun describeContents(): Int {
        return 0
    }
}

data class Price(
    val typeId: Int,
    val productId: Int?,
    val prices: ArrayList<PricePair>
): Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readInt(),
        parcel.readValue(Int::class.java.classLoader) as? Int,
        parcel.createTypedArrayList(PricePair.CREATOR)
    )

    companion object: GraphQLDeserializer<Price> {
        override fun deserialize(json: JsonObject): Price? {
            val typeId = json.int("typeId") ?: return null
            val productId = json.int("productId")
            val prices = json.array<JsonObject>("prices")
                ?.mapNotNull(PricePair.Companion::deserialize)
                ?.let { ArrayList(it) }
                ?: return null

            return Price(typeId, productId, prices)
        }

        @JvmField @Suppress("unused")
        val CREATOR = createParcel { Price(it) }
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeInt(typeId)
        parcel.writeValue(productId)
        parcel.writeTypedArray(prices.toTypedArray(), 0)
    }

    override fun describeContents(): Int {
        return 0
    }
}