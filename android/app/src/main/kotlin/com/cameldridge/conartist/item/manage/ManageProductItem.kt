package com.cameldridge.conartist.item.manage

import android.view.View
import com.cameldridge.conartist.R
import com.cameldridge.conartist.model.Product
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor.Item
import kotlinx.android.synthetic.main.item_manage_product_type.view.title_label

final class ManageProductItem(val product: Product): Item(R.layout.item_manage_product) {
  override val clickable = true
  override fun setup(view: View) {
    view.title_label.text = product.name
  }
}
