package com.cameldridge.conartist.schema

import android.os.Parcel
import android.os.Parcelable
import com.beust.klaxon.JsonObject
import com.beust.klaxon.int
import com.beust.klaxon.string
import com.cameldridge.conartist.parcel.createParcel

data class Product(
    val id: Int,
    val typeId: Int,
    val name: String,
    val quantity: Int
): Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readInt(),
        parcel.readInt(),
        parcel.readString(),
        parcel.readInt()
    )

    companion object: GraphQLDeserializer<Product> {
        override fun deserialize(json: JsonObject): Product? {
            val id = json.int("id") ?: return null
            val typeId = json.int("typeId") ?: return null
            val name = json.string("name") ?: return null
            val quantity = json.int("quantity") ?: return null

            return Product(id, typeId, name, quantity)
        }

        @JvmField @Suppress("unused")
        val CREATOR = createParcel { Product(it) }
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeInt(id)
        parcel.writeInt(typeId)
        parcel.writeString(name)
        parcel.writeInt(quantity)
    }

    override fun describeContents(): Int {
        return 0
    }
}