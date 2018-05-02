/* @flow */
import { model } from '../model'
import { exportProducts } from '../model/dialog/export'

export function closeDialog() {
  model.next({
    ...model.getValue(),
    dialog: null,
  })
}

export function showExportProductsDialog() {
  model.next({
    ...model.getValue(),
    dialog: exportProducts,
  })
}
