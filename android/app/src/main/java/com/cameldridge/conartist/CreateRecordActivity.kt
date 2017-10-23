package com.cameldridge.conartist

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.support.v7.app.AppCompatActivity
import android.view.MenuItem
import com.cameldridge.conartist.schema.Price
import com.cameldridge.conartist.schema.Product
import com.cameldridge.conartist.schema.ProductType

import kotlinx.android.synthetic.main.activity_create_record.*
import kotlin.properties.Delegates

class CreateRecordActivity : AppCompatActivity() {
    private var productType: ProductType by Delegates.notNull()
    private var products: ArrayList<Product> by Delegates.notNull()
    private var prices: ArrayList<Price> by Delegates.notNull()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_record)

        productType = intent.getParcelableExtra(PRODUCT_TYPE)
        products = intent.getParcelableArrayListExtra(PRODUCTS)
        prices = intent.getParcelableArrayListExtra(PRICES)

        supportActionBar?.title = productType.name
        val adapter = ProductRowListAdapter(this)
        adapter.addAll(products)
        productsList.adapter = adapter
        productsList.setOnItemClickListener { parent, _, position, _ -> println((parent.getItemAtPosition(position) as Product).name) }

        // TODO: make this a save button that sends the GraphQL mutation or saves locally
        //       and sends it when there is internet connection
        fab.setOnClickListener { view -> finish() }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if(item.itemId == android.R.id.home) {
            onBackPressed()
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    companion object {
        private val PRODUCT_TYPE = "pt"
        private val PRODUCTS = "prods"
        private val PRICES = "prices"
        fun newIntent(ctx: Context, productType: ProductType, products: ArrayList<Product>, prices: ArrayList<Price>): Intent {
            val intent = Intent(ctx, CreateRecordActivity::class.java)
            intent.putExtra(PRODUCT_TYPE, productType)
            intent.putParcelableArrayListExtra(PRODUCTS, products)
            intent.putParcelableArrayListExtra(PRICES, prices)
            return intent
        }
    }
}
