/* @flow */
import { model, defaultModel } from '../model'
import { changePassword as changePasswordDialog } from '../model/dialog/change-password'
import { Storage } from '../storage'
import { clearCache } from '../api/apollo'

export function signOut() {
  clearCache()
  window.history.pushState({}, '', '/')
  Storage.remove(Storage.Auth)
  model.next(defaultModel)
}

export function changePassword() {
  model.next({
    ...model.getValue(),
    dialog: changePasswordDialog,
  })
}
