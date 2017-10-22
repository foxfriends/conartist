package com.cameldridge.conartist

import android.content.Context
import android.content.Intent
import android.support.v7.app.AppCompatActivity

import android.support.v4.app.Fragment
import android.support.v4.app.FragmentManager
import android.support.v4.app.FragmentPagerAdapter
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.cameldridge.conartist.schema.FullConvention
import com.cameldridge.conartist.schema.ProductType

import kotlinx.android.synthetic.main.activity_convention_mode.*
import kotlin.properties.Delegates

class ConventionModeActivity : AppCompatActivity() {
    private var sectionsPagerAdapter: SectionsPagerAdapter? = null
    private var convention: FullConvention by Delegates.notNull()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_convention_mode)

        convention = intent.getParcelableExtra(CON)

        setSupportActionBar(toolbar)
        sectionsPagerAdapter = SectionsPagerAdapter(supportFragmentManager)

        container.adapter = sectionsPagerAdapter
    }

    inner class SectionsPagerAdapter(fm: FragmentManager) : FragmentPagerAdapter(fm) {
        override fun getItem(position: Int): Fragment =
            ProductTypesPage.create(convention.productTypes)

        override fun getCount() = 3
    }

    companion object {
        private val CON = "con"

        fun newIntent(ctx: Context, con: FullConvention): Intent {
            val intent = Intent(ctx, ConventionModeActivity::class.java)
            intent.putExtra(CON, con)
            return intent
        }
    }

    class ProductTypesPage: Fragment() {
        private var productTypes: ArrayList<ProductType> by Delegates.notNull()

        override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
        ): View? {
            return inflater.inflate(R.layout.fragment_product_type_list, container, false)
        }

        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            if(arguments.containsKey(PRODUCT_TYPES)) {
                productTypes = arguments.getParcelableArrayList(PRODUCT_TYPES)
            }
        }

        companion object {
            private val PRODUCT_TYPES = "productTypes"

            fun create(productTypes: ArrayList<ProductType>?): ProductTypesPage {
                val page = ProductTypesPage()
                val args = Bundle()
                if(productTypes != null) {
                    args.putParcelableArrayList(PRODUCT_TYPES, productTypes)
                }
                page.arguments = args
                return page
            }
        }
    }
}
