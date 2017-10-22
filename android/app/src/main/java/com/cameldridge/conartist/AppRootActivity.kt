package com.cameldridge.conartist

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.view.View
import android.widget.ArrayAdapter
import com.cameldridge.conartist.api.GraphQLQuery
import com.cameldridge.conartist.schema.Convention
import com.cameldridge.conartist.schema.User
import kotlinx.android.synthetic.main.activity_app_root.*
import kotlin.properties.Delegates

class AppRootActivity : AppCompatActivity() {
    private var conList: ArrayAdapter<Convention> by Delegates.notNull()

    private var user: User? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_app_root)

        conList = ConventionRowListAdapter(this)
        retryButton.setOnClickListener { loadUser() }
        conventionList.adapter = conList
        conventionList.setOnItemClickListener { parent, _, position, _ ->
            val con = parent.getItemAtPosition(position) as Convention
            GraphQLQuery.con(con.meta().code) { filled ->
                if(filled == null) {
                    // TODO: show an error
                } else {
                    user?.let {
                        val i = it.conventions.indexOfFirst { it.meta().code == filled.meta().code }
                        it.conventions[i] = filled
                    }
                    startActivity(ConventionModeActivity.newIntent(this, filled))
                }
            } .execute()
        }

        loadUser()
    }

    private fun loadUser() {
        setUIState(UIState.LOAD)
        GraphQLQuery.user {
            when(it) {
                null -> setUIState(UIState.FAIL)
                else -> {
                    user = it
                    conList.clear()
                    user?.conventions?.let(conList::addAll)
                    setUIState(UIState.LIST)
                }
            }
        }.execute()
    }

    private fun setUIState(state: UIState) {
        loadUserProgress.visibility = View.GONE
        loadUserError.visibility    = View.GONE
        conventionList.visibility   = View.GONE
        when(state) {
            UIState.LOAD -> loadUserProgress.visibility = View.VISIBLE
            UIState.FAIL -> loadUserError.visibility    = View.VISIBLE
            UIState.LIST -> conventionList.visibility   = View.VISIBLE
        }
    }

    companion object {
        internal enum class UIState { LOAD, FAIL, LIST }
        fun newIntent(ctx: Context): Intent {
            return Intent(ctx, AppRootActivity::class.java)
        }
    }
}
