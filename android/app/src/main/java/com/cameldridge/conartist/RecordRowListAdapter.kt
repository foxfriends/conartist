package com.cameldridge.conartist

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.PorterDuff
import android.graphics.PorterDuffColorFilter
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import com.cameldridge.conartist.schema.Product
import com.cameldridge.conartist.schema.ProductType
import com.cameldridge.conartist.schema.Record
import com.cameldridge.conartist.schema.formatTimePretty
import kotlinx.android.synthetic.main.record_list_row.view.*

class RecordRowListAdapter(
    private val ctx: Context,
    private val products: ArrayList<Product>,
    private val productTypes: ArrayList<ProductType>
): ArrayAdapter<Record>(ctx, R.layout.record_list_row) {
    @SuppressLint("DefaultLocale", "SetTextI18n")
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View? {
        val record = getItem(position) ?: return null
        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.record_list_row, parent, false)

        val rProducts = record
            .products
            .mapNotNull { id -> products.find { it.id == id } }

        val rType = productTypes.find { it.id == rProducts[0].typeId }
        val color = ((rType?.color ?: 0xFFFFFF).toLong() or 0xFF000000).toInt()

        view.typeIdentifier.text = rType?.name?.substring(0..0) ?: "?"
        view.typeIdentifier.background = ctx.getDrawable(R.drawable.circle)
        view.typeIdentifier.background.colorFilter = PorterDuffColorFilter(color, PorterDuff.Mode.MULTIPLY)

        view.productsList.text = rProducts
            .fold(emptyMap()) { map: Map<String, Int>, product ->
                map.plus(product.name to (map[product.name] ?: 0) + 1)
            }
            .asIterable()
            .joinToString {
                when (it.value) {
                    1 -> it.key
                    else -> "%s (%d)".format(it.key, it.value)
                }
            }

        // TODO: Support for other currencies
        view.price.text = "$%.2f".format(record.price)

        view.saleTime.text = formatTimePretty(record.time)

        return view
    }
}
