package com.cameldridge.conartist

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.annotation.TargetApi
import android.content.pm.PackageManager
import android.support.design.widget.Snackbar
import android.support.v7.app.AppCompatActivity
import android.app.LoaderManager.LoaderCallbacks
import android.content.CursorLoader
import android.content.Loader
import android.database.Cursor
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.ContactsContract
import android.text.TextUtils
import android.view.View
import android.view.inputmethod.EditorInfo
import android.widget.ArrayAdapter
import android.widget.TextView

import java.util.ArrayList
import android.Manifest.permission.READ_CONTACTS
import android.content.Context
import android.content.Intent
import com.cameldridge.conartist.api.UserLoginTask

import kotlinx.android.synthetic.main.activity_login.*

/**
 * A login screen that offers login via email/password.
 */
class LoginActivity : AppCompatActivity(), LoaderCallbacks<Cursor> {
    /**
     * Keep track of the login task to ensure we can cancel it if requested.
     */
    private var authTask: UserLoginTask? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        // Set up the login form.
        populateAutoComplete()
        passwordField.setOnEditorActionListener(TextView.OnEditorActionListener { _, id, _ ->
            if (id == EditorInfo.IME_ACTION_DONE || id == EditorInfo.IME_NULL) {
                attemptLogin()
                return@OnEditorActionListener true
            }
            false
        })

        signInButton.setOnClickListener { attemptLogin() }
    }

    private fun populateAutoComplete() {
        if (!mayRequestContacts()) {
            return
        }

        loaderManager.initLoader(0, null, this)
    }

    private fun mayRequestContacts(): Boolean {
        if (checkSelfPermission(READ_CONTACTS) == PackageManager.PERMISSION_GRANTED) {
            return true
        }
        if (shouldShowRequestPermissionRationale(READ_CONTACTS)) {
            Snackbar
                .make(emailField, R.string.permission_rationale, Snackbar.LENGTH_INDEFINITE)
                .setAction(android.R.string.ok) {
                    requestPermissions(arrayOf(READ_CONTACTS), REQUEST_READ_CONTACTS)
                }
        } else {
            requestPermissions(arrayOf(READ_CONTACTS), REQUEST_READ_CONTACTS)
        }
        return false
    }

    /**
     * Callback received when a permissions request has been completed.
     */
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        if (requestCode == REQUEST_READ_CONTACTS) {
            if (grantResults.size == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                populateAutoComplete()
            }
        }
    }


    /**
     * Attempts to sign in or register the account specified by the login form.
     * If there are form errors (invalid email, missing fields, etc.), the
     * errors are presented and no actual login attempt is made.
     */
    private fun attemptLogin() {
        if (authTask != null) {
            return
        }

        // Reset errors.
        emailField.error = null
        passwordField.error = null

        // Store values at the time of the login attempt.
        val email = emailField.text.toString()
        val password = passwordField.text.toString()

        var cancel = false
        var focusView: View? = null

        // Check for a valid password, if the user entered one.
        if (!TextUtils.isEmpty(password) && !isPasswordValid(password)) {
            passwordField.error = getString(R.string.error_invalid_password)
            focusView = passwordField
            cancel = true
        }

        // Check for a valid email address.
        if (TextUtils.isEmpty(email)) {
            emailField.error = getString(R.string.error_field_required)
            focusView = emailField
            cancel = true
        } else if (!isEmailValid(email)) {
            emailField.error = getString(R.string.error_invalid_email)
            focusView = emailField
            cancel = true
        }

        if (cancel) {
            // There was an error; don't attempt login and focus the first
            // form field with an error.
            focusView?.requestFocus()
        } else {
            // Show a progress spinner, and kick off a background task to
            // perform the user login attempt.
            showProgress(true)
            authTask = UserLoginTask(email, password) { authToken ->
                authTask = null
                showProgress(false)
                if(authToken != null) {
                    val intent = Intent()
                    intent.putExtra("authToken", authToken)
                    setResult(SUCCESS, intent)
                    finish()
                } else {
                    passwordField.error = getString(R.string.error_incorrect_password)
                    passwordField.requestFocus()
                }
            }
            authTask!!.execute(null as Void?)
        }
    }

    // TODO: change these when the app has some email/password validation in place
    private fun isEmailValid(email: String): Boolean {
        return email.isNotEmpty()
    }

    private fun isPasswordValid(password: String): Boolean {
        return password.isNotEmpty()
    }

    /**
     * Shows the progress UI and hides the login form.
     */
    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private fun showProgress(show: Boolean) {
        val shortAnimTime = resources.getInteger(android.R.integer.config_shortAnimTime).toLong()

        loginForm.visibility = if (show) View.GONE else View.VISIBLE
        loginForm.animate()
            .setDuration(shortAnimTime)
            .alpha((if (show) 0 else 1).toFloat())
            .setListener(object : AnimatorListenerAdapter() {
                override fun onAnimationEnd(animation: Animator) {
                    loginForm.visibility = if (show) View.GONE else View.VISIBLE
                }
            })

        loginProgress.visibility = if (show) View.VISIBLE else View.GONE
        loginProgress.animate()
            .setDuration(shortAnimTime)
            .alpha((if (show) 1 else 0).toFloat())
            .setListener(object : AnimatorListenerAdapter() {
                override fun onAnimationEnd(animation: Animator) {
                    loginProgress.visibility = if (show) View.VISIBLE else View.GONE
                }
            })
    }

    override fun onCreateLoader(i: Int, bundle: Bundle?): Loader<Cursor> {
        return CursorLoader(
            this,

            // Retrieve data rows for the device user's 'profile' contact.
            Uri.withAppendedPath(ContactsContract.Profile.CONTENT_URI,ContactsContract.Contacts.Data.CONTENT_DIRECTORY),
            ProfileQuery.PROJECTION,

            // Select only email addresses.
            ContactsContract.Contacts.Data.MIMETYPE + " = ?",
            arrayOf(ContactsContract.CommonDataKinds.Email.CONTENT_ITEM_TYPE),

            // Show primary email addresses first. Note that there won't be
            // a primary email address if the user hasn't specified one.
            ContactsContract.Contacts.Data.IS_PRIMARY + " DESC"
        )
    }

    override fun onLoadFinished(cursorLoader: Loader<Cursor>, cursor: Cursor) {
        val emails = ArrayList<String>()
        cursor.moveToFirst()
        while (!cursor.isAfterLast) {
            emails.add(cursor.getString(ProfileQuery.ADDRESS))
            cursor.moveToNext()
        }

        addEmailsToAutoComplete(emails)
    }

    override fun onLoaderReset(cursorLoader: Loader<Cursor>) {}

    private fun addEmailsToAutoComplete(emailAddressCollection: List<String>) {
        //Create adapter to tell the AutoCompleteTextView what to show in its dropdown list.
        val adapter = ArrayAdapter(this@LoginActivity,
            android.R.layout.simple_dropdown_item_1line,
            emailAddressCollection
        )

        emailField.setAdapter(adapter)
    }

    object ProfileQuery {
        val PROJECTION = arrayOf(
            ContactsContract.CommonDataKinds.Email.ADDRESS,
            ContactsContract.CommonDataKinds.Email.IS_PRIMARY
        )
        val ADDRESS = 0
        val IS_PRIMARY = 1
    }

    companion object {

        /**
         * Id to identify READ_CONTACTS permission request.
         */
        private val REQUEST_READ_CONTACTS = 0

        val SUCCESS = 0
        val FAILURE = 1

        fun newIntent(ctx: Context): Intent {
            return Intent(ctx, LoginActivity::class.java)
        }
    }
}
