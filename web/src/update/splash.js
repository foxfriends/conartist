import { model } from '../model'
import { signin } from '../model/dialog/signin'
import { signup } from '../model/dialog/signup'

export function showSigninDialog() {
  model.next({
    ...model.getValue(),
    dialog: signin,
  })
}

export function showSignupDialog() {
  model.next({
    ...model.getValue(),
    dialog: signup,
  })
}
