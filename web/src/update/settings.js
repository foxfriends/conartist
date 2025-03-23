/*       */
import { model, defaultModel } from '../model'
import { changePassword as changePasswordDialog } from '../model/dialog/change-password'
import { changeEmail as changeEmailDialog } from '../model/dialog/change-email'
import { changeName as changeNameDialog } from '../model/dialog/change-name'
import { changeLanguage as changeLanguageDialog } from '../model/dialog/change-language'
import { changeCurrency as changeCurrencyDialog } from '../model/dialog/change-currency'
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

export function changeLanguage() {
  model.next({
    ...model.getValue(),
    dialog: changeLanguageDialog,
  })
}

export function changeCurrency() {
  model.next({
    ...model.getValue(),
    dialog: changeCurrencyDialog,
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

export function setLanguage(language) {
  model.next({
    ...model.getValue(),
    settings: {
      ...model.getValue().settings,
      language,
    },
  })
}

export function setCurrency(currency) {
  model.next({
    ...model.getValue(),
    settings: {
      ...model.getValue().settings,
      currency,
    },
  })
}
