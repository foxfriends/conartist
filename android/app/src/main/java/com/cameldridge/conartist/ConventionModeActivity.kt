package com.cameldridge.conartist

import android.content.Context
import android.content.Intent
import android.support.design.widget.Snackbar
import android.support.v7.app.AppCompatActivity

import android.support.v4.app.Fragment
import android.support.v4.app.FragmentManager
import android.support.v4.app.FragmentPagerAdapter
import android.support.v4.view.ViewPager
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup

import kotlinx.android.synthetic.main.activity_convention_mode.*
import kotlinx.android.synthetic.main.fragment_convention_mode.view.*

class ConventionModeActivity : AppCompatActivity() {
    private var sectionsPagerAdapter: SectionsPagerAdapter? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_convention_mode)

        setSupportActionBar(toolbar)
        sectionsPagerAdapter = SectionsPagerAdapter(supportFragmentManager)

        container.adapter = sectionsPagerAdapter
    }

    inner class SectionsPagerAdapter(fm: FragmentManager) : FragmentPagerAdapter(fm) {
        override fun getItem(position: Int): Fragment =
            when(position) {
                0 -> PlaceholderFragment.newInstance(position + 1)
                1 -> PlaceholderFragment.newInstance(position + 1)
                2 -> PlaceholderFragment.newInstance(position + 1)
                else -> PlaceholderFragment.newInstance(position + 1)
            }

        override fun getCount() = 3
    }

    companion object {
        private val CON_CODE = "code"

        fun newIntent(ctx: Context, code: String): Intent {
            val intent = Intent(ctx, ConventionModeActivity::class.java)
            intent.putExtra(CON_CODE, code)
            return intent
        }
    }

    /**
     * A placeholder fragment containing a simple view.
     */
    class PlaceholderFragment : Fragment() {
        override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
        ): View? {
            val rootView = inflater.inflate(R.layout.fragment_convention_mode, container, false)
            rootView.section_label.text = getString(R.string.section_format, arguments.getInt(ARG_SECTION_NUMBER))
            return rootView
        }

        companion object {
            /**
             * The fragment argument representing the section number for this
             * fragment.
             */
            private val ARG_SECTION_NUMBER = "section_number"

            /**
             * Returns a new instance of this fragment for the given section
             * number.
             */
            fun newInstance(sectionNumber: Int): PlaceholderFragment {
                val fragment = PlaceholderFragment()
                val args = Bundle()
                args.putInt(ARG_SECTION_NUMBER, sectionNumber)
                fragment.arguments = args
                return fragment
            }
        }
    }
}
