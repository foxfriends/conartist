package com.cameldridge.conartist

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import com.cameldridge.conartist.schema.Convention
import com.cameldridge.conartist.schema.formatDatePretty
import kotlinx.android.synthetic.main.convention_list_row.view.*

class ConventionRowListAdapter(private val ctx: Context): ArrayAdapter<Convention>(ctx, R.layout.convention_list_row) {
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View? {
        val con = getItem(position)?.meta() ?: return null
        val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.convention_list_row, parent, false)

        view.rowName.text = con.name
        view.rowCode.text = con.code
        view.rowDate.text = String.format(ctx.getString(R.string.date_range), formatDatePretty(con.start), formatDatePretty(con.end))

        return view
    }
}
