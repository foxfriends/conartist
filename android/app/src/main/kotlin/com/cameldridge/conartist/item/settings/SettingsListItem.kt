package com.cameldridge.conartist.item.settings

import androidx.annotation.LayoutRes
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor

abstract class SettingsListItem(@LayoutRes layout: Int): RecyclerViewAdaptor.Item(layout)
