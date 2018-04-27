/* @flow */
import { model, defaultModel } from '../model'
import { changePassword as changePasswordDialog } from '../model/dialog/change-password'
import { Storage } from '../storage'

export function signOut() {
  Storage.remove(Storage.Auth)
  model.next(defaultModel)
}

export function changePassword() {
  model.next({
    ...model.getValue(),
    dialog: changePasswordDialog,
  })
}
