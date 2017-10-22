package com.cameldridge.conartist.schema

import android.os.Parcel
import android.os.Parcelable
import com.beust.klaxon.JsonObject
import com.beust.klaxon.array
import com.beust.klaxon.int
import com.beust.klaxon.string
import java.util.*

interface Convention {
    fun meta(): MetaConvention
}

data class MetaConvention(
    val conId: Int,
    val name: String,
    val code: String,
    val start: Date,
    val end: Date
): Convention {
    override fun meta() = this

    override fun equals(other: Any?): Boolean {
        return when(other) {
            is MetaConvention -> other.conId == conId
            else -> false
        }
    }

    override fun hashCode(): Int {
        return code.hashCode()
    }

    companion object: GraphQLDeserializer<MetaConvention> {
        override fun deserialize(json: JsonObject): MetaConvention? {
            val id = json.int("id") ?: return null
            val name = json.string("name") ?: return null
            val code = json.string("code") ?: return null
            val start = json.string("start") ?: return null
            val end = json.string("end") ?: return null

            return MetaConvention(id, name, code, parseDate(start), parseDate(end))
        }
    }
}

data class FullConvention(
    val conId: Int,
    val name: String,
    val code: String,
    val start: Date,
    val end: Date,
    val productTypes: ArrayList<ProductType>,
    val products: ArrayList<Product>,
    val prices: ArrayList<Price>,
    val records: ArrayList<Record>,
    val expenses: ArrayList<Expense>
): Convention, Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readInt(),
        parcel.readString(),
        parcel.readString(),
        parseDate(parcel.readString()),
        parseDate(parcel.readString()),
        parcel.createTypedArrayList(ProductType.CREATOR),
        parcel.createTypedArrayList(Product.CREATOR),
        parcel.createTypedArrayList(Price.CREATOR),
        parcel.createTypedArrayList(Record.CREATOR),
        parcel.createTypedArrayList(Expense.CREATOR)
    )

    override fun meta() = MetaConvention(conId, name, code, start, end)

    override fun equals(other: Any?): Boolean {
        return when(other) {
            is FullConvention -> other.conId == conId
            else -> false
        }
    }

    override fun hashCode(): Int {
        return code.hashCode()
    }

    companion object: GraphQLDeserializer<FullConvention> {
        override fun deserialize(json: JsonObject): FullConvention? {
            val id = json.int("id") ?: return null
            val name = json.string("name") ?: return null
            val code = json.string("code") ?: return null
            val start = json.string("start") ?: return null
            val end = json.string("end") ?: return null
            val productTypes = json.array<JsonObject>("productTypes")
                ?.mapNotNull(ProductType.Companion::deserialize)
                ?.let{ ArrayList(it) }
                ?: return null
            val products = json.array<JsonObject>("products")
                ?.mapNotNull(Product.Companion::deserialize)
                ?.let { ArrayList(it) }
                ?: return null
            val prices = json.array<JsonObject>("condensedPrices")
                ?.mapNotNull(Price.Companion::deserialize)
                ?.let { println(it); ArrayList(it) }
                ?: return null
            val records = json.array<JsonObject>("records")
                ?.mapNotNull(Record.Companion::deserialize)
                ?.let { ArrayList(it) }
                ?: return null
            val expenses = json.array<JsonObject>("expenses")
                ?.mapNotNull(Expense.Companion::deserialize)
                ?.let { ArrayList(it) }
                ?: return null

            return FullConvention(
                id,
                name,
                code,
                parseDate(start),
                parseDate(end),
                productTypes,
                products,
                prices,
                records,
                expenses
            )
        }

        @JvmField @Suppress("unused")
        val CREATOR = createParcel { FullConvention(it) }
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeInt(conId)
        parcel.writeString(name)
        parcel.writeString(code)
        parcel.writeString(formatDate(start))
        parcel.writeString(formatDate(end))
        parcel.writeTypedArray(productTypes.toTypedArray(), 0)
        parcel.writeTypedArray(products.toTypedArray(), 0)
        parcel.writeTypedArray(prices.toTypedArray(), 0)
        parcel.writeTypedArray(records.toTypedArray(), 0)
        parcel.writeTypedArray(expenses.toTypedArray(), 0)
    }

    override fun describeContents(): Int {
        return 0
    }
}
