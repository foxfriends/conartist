package com.cameldridge.conartist.services

import com.cameldridge.conartist.model.ConRequest
import io.reactivex.Single
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ConArtistAPI {
  data class SignIn(val usr: String, val psw: String)
  @POST("/auth")
  fun signIn(@Body body: SignIn): Single<ConRequest<String>>

  @GET("/auth")
  fun reauthorize(): Single<ConRequest<String>>

  data class NewAccount(val name: String, val email: String, val password: String)
  @POST("/account/new")
  fun createAccount(@Body body: NewAccount): Single<ConRequest<String>>

  @GET("/account/exists/{email}")
  fun accountExists(
    @Path("email") email: String
  ): Single<ConRequest<Boolean>>

  @POST("/account/resend-verification")
  fun resendVerificationEmail(): Single<ConRequest<Unit>>
}
