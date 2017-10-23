package com.cameldridge.conartist

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.graphics.PorterDuff
import android.graphics.PorterDuffColorFilter
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.support.v7.app.AppCompatActivity
import android.view.LayoutInflater
import android.view.MenuItem
import com.cameldridge.conartist.schema.Price
import com.cameldridge.conartist.schema.PricePair
import com.cameldridge.conartist.schema.Product
import com.cameldridge.conartist.schema.ProductType

import kotlinx.android.synthetic.main.activity_create_record.*
import kotlinx.android.synthetic.main.product_chip.view.*
import kotlin.properties.Delegates

class CreateRecordActivity : AppCompatActivity() {
    private var productType: ProductType by Delegates.notNull()
    private var products: ArrayList<Product> by Delegates.notNull()
    private var prices: ArrayList<Price> by Delegates.notNull()
    private var defaultPrice: Price by Delegates.notNull()
    private var selected: ArrayList<Product> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_record)

        productType = intent.getParcelableExtra(PRODUCT_TYPE)
        products = intent.getParcelableArrayListExtra(PRODUCTS)
        prices = intent.getParcelableArrayListExtra(PRICES)
        defaultPrice = prices
            .find { it.productId == null }
            ?: Price(productType.id, null, arrayListOf(PricePair(1, 0.0)))

        supportActionBar?.title = productType.name
        val adapter = ProductRowListAdapter(this)
        adapter.addAll(products)
        productsList.adapter = adapter
        productsList.setOnItemClickListener { parent, _, position, _ ->
            val product = parent.getItemAtPosition(position) as Product
            addProduct(product)
        }

        // TODO: make this a save button that sends the GraphQL mutation or saves locally
        //       and sends it when there is internet connection
        saveButton.setOnClickListener { view -> finish() }
        updateSaveButtonState()
    }

    @SuppressLint("SetTextI18n")
    private fun addProduct(product: Product) {
        selected.add(product)
        val chip = LayoutInflater.from(this).inflate(R.layout.product_chip, chips, false)
        chip.productName.text = product.name
        chip.setOnClickListener { removeProduct(chips.indexOfChild(it)) }
        chips.addView(chip)
        priceField.setText("%.2f".format(calculatePrice()))
        updateSaveButtonState()
    }

    @SuppressLint("SetTextI18n")
    private fun removeProduct(index: Int) {
        selected.removeAt(index)
        chips.removeViewAt(index)
        priceField.setText("%.2f".format(calculatePrice()))
        updateSaveButtonState()
    }

    private fun updateSaveButtonState() {
        if(selected.size == 0) {
            saveButton.isEnabled = false
            saveButton.background.colorFilter = PorterDuffColorFilter(0xFF999999.toInt(), PorterDuff.Mode.SRC_IN)
        } else {
            saveButton.isEnabled = true
            saveButton.background.colorFilter = null
        }
    }

    private fun calculatePrice(): Double =
        selected
            .fold(emptyMap()) { map: Map<Price, Int>, product ->
                val price = prices.find { it.productId == product.id } ?: defaultPrice
                map.plus(price to (map[price] ?: 0) + 1)
            }
            .asIterable()
            .fold(0.0) { total, entry ->
                val price = entry.key
                var qty = entry.value
                var money = 0.0
                while(qty > 0) {
                    val pair = price.prices.fold(PricePair(1, 0.0)) { best, pair ->
                        if(pair.quantity >= best.quantity && pair.quantity <= qty) {
                            pair
                        } else {
                            best
                        }
                    }
                    qty -= pair.quantity
                    money += pair.price
                }
                total + money
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
