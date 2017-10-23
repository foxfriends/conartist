package com.cameldridge.conartist

import android.content.Intent
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import com.cameldridge.conartist.api.Authorization
import com.github.kittinunf.fuel.core.FuelManager

/**
 * This is the entry point of the app. I guess spashscreen like thing
 * Directs the user straight to the login page. When navigated back to the app will just close.
 */
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FuelManager.instance.basePath = "https://con--artist.herokuapp.com/api"
        setContentView(R.layout.activity_main)

        startActivityForResult(LoginActivity.newIntent(this), SIGN_IN)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, intent: Intent?) {
        when(requestCode) {
            SIGN_IN -> {
                when(resultCode) {
                    LoginActivity.SUCCESS -> {
                        if(intent != null) {
                            Authorization.set(intent.getStringExtra(LoginActivity.AUTH_TOKEN))
                        }
                        startActivityForResult(AppRootActivity.newIntent(this), APP)
                    }
                    LoginActivity.FAILURE -> finish()
                }
            }
            APP -> finish()
        }
    }

    override fun onBackPressed() {
        finish()
    }

    companion object {
        val SIGN_IN = 0
        val APP = 1
    }
}
