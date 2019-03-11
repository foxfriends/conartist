package com.cameldridge.conartist.item.manage

import android.view.View
import androidx.recyclerview.widget.ItemTouchHelper
import com.cameldridge.conartist.R
import com.cameldridge.conartist.model.ProductType
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor.Item
import kotlinx.android.synthetic.main.item_manage_product_type.view.title_label

final class ManageProductTypeItem(val productType: ProductType, val isEditing: Boolean): Item(R.layout.item_manage_product_type) {
  override val clickable = true

  override val dragFlags: Int
    get() = if (isEditing) { ItemTouchHelper.UP or ItemTouchHelper.DOWN } else { 0 }

  override fun setup(view: View) {
    view.title_label.text = productType.name
  }
}
