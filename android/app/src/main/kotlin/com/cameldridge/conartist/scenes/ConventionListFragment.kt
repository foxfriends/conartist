package com.cameldridge.conartist.scenes

import android.os.Bundle
import android.view.View
import com.cameldridge.conartist.ConArtist
import com.cameldridge.conartist.R
import com.cameldridge.conartist.R.string
import com.cameldridge.conartist.model.ConRequest
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.services.api.ConArtistAPI.SignIn
import com.cameldridge.conartist.util.ConArtistFragment
import com.jakewharton.rxbinding3.view.clicks
import com.jakewharton.rxbinding3.widget.textChanges
import io.reactivex.rxkotlin.Observables
import io.reactivex.rxkotlin.addTo
import io.reactivex.rxkotlin.withLatestFrom
import kotlinx.android.synthetic.main.fragment_sign_in.*

class ConventionListFragment : ConArtistFragment(R.layout.fragment_convention_list) {
}
