package com.cameldridge.conartist

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import com.cameldridge.conartist.api.API
import com.cameldridge.conartist.api.Authorization
import com.github.kittinunf.fuel.core.FuelManager
import me.lazmaid.kraph.Kraph
import android.content.IntentFilter
import android.net.ConnectivityManager.CONNECTIVITY_ACTION
import android.widget.Toast


fun Context.isConnected(): Boolean {
    val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    return cm.activeNetworkInfo.isConnectedOrConnecting
}

/**
 * This is the entry point of the app. I guess spashscreen like thing
 * Directs the user straight to the login page. When navigated back to the app will just close.
 */
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FuelManager.instance.basePath = API.baseURL + API.apiURL

        Kraph.fragment("MetaConvention") {
            field("id")
            field("code")
            field("name")
            field("start")
            field("end")
        }
        Kraph.fragment("Record") {
            field("products")
            field("price")
            field("time")
        }

        setContentView(R.layout.activity_main)

        startActivityForResult(LoginActivity.newIntent(this), SIGN_IN)

        API.available = isConnected()

        val filter = IntentFilter()
        filter.addAction(CONNECTIVITY_ACTION)
        registerReceiver(object: BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                API.available = context?.isConnected() == true
                Toast.makeText(context, if(API.available) { "Connected!" } else { "Disconnected!" }, Toast.LENGTH_SHORT).show()
            }
        }, filter)
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
                    else -> finish()
                }
            }
            APP -> finish()
            else -> super.onActivityResult(requestCode, resultCode, intent)
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
