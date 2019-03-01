package com.cameldridge.conartist.item.manage

import android.view.View
import com.cameldridge.conartist.R
import com.cameldridge.conartist.model.ProductType
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor.Item
import kotlinx.android.synthetic.main.item_manage_product_type.view.title_label

final class ManageProductTypeItem(val productType: ProductType): Item(R.layout.item_settings_button) {
  override val clickable = true
  override fun setup(view: View) {
    view.title_label.text = productType.name
  }
}
