package com.cameldridge.conartist.util.extension

import androidx.fragment.app.FragmentManager

fun FragmentManager.visibleFragment() = fragments.find { it.isVisible }
