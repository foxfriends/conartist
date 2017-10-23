package com.cameldridge.conartist

import android.content.Context
import android.graphics.PorterDuff
import android.graphics.PorterDuffColorFilter
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import com.cameldridge.conartist.schema.Price
import com.cameldridge.conartist.schema.ProductType
import kotlinx.android.synthetic.main.product_type_list_row.view.*

class ProductTypeRowListAdapter(
    private val ctx: Context,
    private val prices: ArrayList<Price>
): ArrayAdapter<ProductType>(ctx, R.layout.product_type_list_row) {
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View? {
        val pt = getItem(position) ?: return null
        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.product_type_list_row, parent, false)

        view.typeIdentifier.text = pt.name.substring(0..0)
        view.typeIdentifier.background = ctx.getDrawable(R.drawable.circle)
        view.typeIdentifier.background.colorFilter = PorterDuffColorFilter((0xFF000000 or pt.color.toLong()).toInt(), PorterDuff.Mode.MULTIPLY)
        view.typeName.text = pt.name
        view.pricingInfo.text =
            prices
                .find{ it.typeId == pt.id && it.productId == null }
                ?.prices
                ?.sortedBy { it.quantity }
                ?.take(3)
                ?.joinToString("\n") { "%d: $%.2f".format(it.quantity, it.price) }

        return view
    }
}
