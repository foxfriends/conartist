/* @flow */
import { model } from '../model'
import { dashboard } from '../model/page'

export function completeSignIn() {
  model.next({
    ...model.getValue(),
    dialog: null,
    page: dashboard,
  })
}
