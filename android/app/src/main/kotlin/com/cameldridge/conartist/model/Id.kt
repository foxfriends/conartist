package com.cameldridge.conartist.model

import java.util.UUID

sealed class Id {
  data class Id(val int: Int) : com.cameldridge.conartist.model.Id()
  data class Uuid(val uuid: UUID): com.cameldridge.conartist.model.Id()
}
