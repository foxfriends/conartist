/*       */
import { model } from '../model'
import { exportProducts, exportRecords } from '../model/dialog/export'
import { importProducts } from '../model/dialog/import'
import { resetPassword } from '../model/dialog/reset-password'
import { createSuggestion } from '../model/dialog/create-suggestion'
import { newSale } from '../model/dialog/new-sale'
import { newExpense } from '../model/dialog/new-expense'

                                                     

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

export function showExportRecordsDialog(convention            ) {
  model.next({
    ...model.getValue(),
    dialog: exportRecords(convention),
  })
}

export function showImportProductsDialog() {
  model.next({
    ...model.getValue(),
    dialog: importProducts,
  })
}

export function showResetPasswordDialog(email         = '') {
  model.next({
    ...model.getValue(),
    dialog: resetPassword(email),
  })
}

export function showCreateSuggestionDialog() {
  model.next({
    ...model.getValue(),
    dialog: createSuggestion,
  })
}

export function showNewSaleDialog(sale          ) {
  model.next({
    ...model.getValue(),
    dialog: newSale(sale),
  })
}

export function showNewExpenseDialog(expense           ) {
  model.next({
    ...model.getValue(),
    dialog: newExpense(expense),
  })
}
