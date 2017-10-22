package com.cameldridge.conartist.schema

import android.os.Parcel
import android.os.Parcelable
import com.beust.klaxon.JsonObject
import com.beust.klaxon.int
import com.beust.klaxon.string

data class ProductType(
    val id: Int,
    val name: String,
    val color: Int
): Parcelable {
    private constructor(parcelIn: Parcel) : this(
        parcelIn.readInt(),
        parcelIn.readString(),
        parcelIn.readInt()
    )

    override fun describeContents() = 0

    override fun writeToParcel(dest: Parcel, flags: Int) {
        dest.writeInt(id)
        dest.writeString(name)
        dest.writeInt(color)
    }

    companion object: GraphQLDeserializer<ProductType> {
        override fun deserialize(json: JsonObject): ProductType? {
            val id = json.int("id") ?: return null
            val name = json.string("name") ?: return null
            val color = json.int("color") ?: return null

            return ProductType(id, name, color)
        }

        @JvmField @Suppress("unused")
        val CREATOR = createParcel { ProductType(it) }
    }
}

// TODO: This is just copied from internet. Put it somewhere real
inline fun <reified T : Parcelable> createParcel(crossinline createFromParcel: (Parcel) -> T?): Parcelable.Creator<T> =
    object : Parcelable.Creator<T> {
        override fun createFromParcel(source: Parcel): T? = createFromParcel(source)
        override fun newArray(size: Int): Array<out T?> = arrayOfNulls(size)
    }