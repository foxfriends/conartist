package com.cameldridge.conartist

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import com.cameldridge.conartist.schema.Product
import kotlinx.android.synthetic.main.product_list_row.view.*

class ProductRowListAdapter(
    ctx: Context
): ArrayAdapter<Product>(ctx, R.layout.product_list_row) {
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View? {
        val product = getItem(position) ?: return null
        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.product_list_row, parent, false)

        view.productName.text = product.name
        view.quantity.text = "%d".format(product.quantity)

        return view
    }
}
