/* @flow */
import { model } from '../model'

export function closeDialog() {
  model.next({ ...model.getValue(), dialog: null })
}
