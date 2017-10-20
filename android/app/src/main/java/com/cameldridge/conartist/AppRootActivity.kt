package com.cameldridge.conartist

import android.content.Context
import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle

class AppRootActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
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
