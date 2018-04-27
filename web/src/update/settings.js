/* @flow */
import { model, defaultModel } from '../model'
import { splash } from '../model/page'
import { Storage } from '../storage'

export function signOut() {
  Storage.remove(Storage.Auth)
  model.next(defaultModel)
}
