/* @flow */
import { model, defaultModel } from '../model'
import { changePassword as changePasswordDialog } from '../model/dialog/change-password'
import { changeEmail as changeEmailDialog } from '../model/dialog/change-email'
import { changeName as changeNameDialog } from '../model/dialog/change-name'
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

export function changeEmail() {
  model.next({
    ...model.getValue(),
    dialog: changeEmailDialog,
  })
}

export function changeName() {
  model.next({
    ...model.getValue(),
    dialog: changeNameDialog,
  })
}

export function setName(name) {
  model.next({
    ...model.getValue(),
    user: {
      ...model.getValue().user,
      name,
    },
  })
}
