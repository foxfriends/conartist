package com.cameldridge.conartist

import android.content.Context
import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import com.cameldridge.conartist.schema.Convention
import kotlin.properties.Delegates

class AppRootActivity : AppCompatActivity() {
    private var conventions: ArrayList<Convention> by Delegates.notNull()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // TODO: Send load convention request
        setContentView(R.layout.activity_app_root)
    }

    companion object {
        fun newIntent(ctx: Context, authToken: String): Intent {
            val intent = Intent(ctx, AppRootActivity::class.java)
            intent.putExtra("authToken", authToken)
            return intent
        }
    }
}
