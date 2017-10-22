package com.cameldridge.conartist

import android.content.Context
import android.graphics.PorterDuff
import android.graphics.PorterDuffColorFilter
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import com.cameldridge.conartist.schema.ProductType
import kotlinx.android.synthetic.main.product_type_list_row.view.*

class ProductTypeRowListAdapter(private val ctx: Context): ArrayAdapter<ProductType>(ctx, R.layout.product_type_list_row) {
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View? {
        val pt = getItem(position) ?: return null
        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.convention_list_row, parent, false)

        view.typeIdentifier.text = pt.name.substring(0..1)
        view.typeIdentifier.background = ctx.getDrawable(R.drawable.circle)
        view.typeIdentifier.background.colorFilter = PorterDuffColorFilter(pt.color, PorterDuff.Mode.SRC_IN)
        view.typeName.text = pt.name

        return view
    }
}
