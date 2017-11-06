package com.cameldridge.conartist

import android.content.Context
import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.MenuItem
import com.cameldridge.conartist.schema.FullConvention
import com.cameldridge.conartist.schema.formatDatePretty
import kotlinx.android.synthetic.main.activity_meta_convention.*
import kotlin.properties.Delegates

class MetaConventionActivity : AppCompatActivity() {
    private var con: FullConvention by Delegates.notNull()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_meta_convention)

        con = intent.getParcelableExtra(CON)
        supportActionBar?.title = con.name
        date.text = resources.getString(R.string.labelled_date_range, formatDatePretty(con.start), formatDatePretty(con.end))
        code.text = resources.getString(R.string.labelled_code, con.code)
        expenseButton.setOnClickListener {
            startActivityForResult(CreateExpenseActivity.newIntent(this), CREATE_EXPENSE)
        }
        startButton.setOnClickListener {
            startActivity(ConventionModeActivity.newIntent(this, con))
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if(item.itemId == android.R.id.home) {
            onBackPressed()
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    companion object {
        private val CON = "con"
        private val CREATE_EXPENSE = 14

        fun newIntent(ctx: Context, con: FullConvention): Intent {
            val intent = Intent(ctx, MetaConventionActivity::class.java)
            intent.putExtra(CON, con)
            return intent
        }
    }
}
