/* @flow */
import { showSignupDialog, showSigninDialog } from '../update/splash'
import { showNewSaleDialog, showCreateSuggestionDialog, showExportProductsDialog, showExportRecordsDialog, showImportProductsDialog } from '../update/dialog'
import * as navigate from '../update/navigate'
import { send, SaveProducts as SaveProductsEvent, SavePrices as SavePricesEvent } from '../event'
import type { Action } from '../common/button'
import type { Convention } from '../model/convention'

export const LogIn: Action = {
  title: 'Sign in',
  action: showSigninDialog,
}

export const NewSale: Action = {
  title: 'New Sale',
  action: () => showNewSaleDialog(),
}

export const SignUp: Action = {
  title: 'Sign up',
  action: showSignupDialog,
}

export const EditProducts: Action = {
  title: 'Edit',
  action: navigate.editProducts,
}

export const ExportProducts: Action = {
  title: 'Export',
  action: showExportProductsDialog,
}

export const ImportProducts: Action = {
  title: 'Import',
  action: showImportProductsDialog,
}

export const DiscardProducts: Action = {
  title: 'Discard',
  action: navigate.products,
}

export const SaveProducts: Action = {
  title: 'Save',
  action: () => send(SaveProductsEvent),
}

export const EditPrices: Action = {
  title: 'Edit',
  action: navigate.editPrices,
}

export const DiscardPrices: Action = {
  title: 'Discard',
  action: navigate.prices,
}

export const CreateSuggestion: Action = {
  title: 'Make a suggestion',
  action: showCreateSuggestionDialog,
}

export const SavePrices: Action = {
  title: 'Save',
  action: () => send(SavePricesEvent),
}

export function ExportRecords(convention: Convention): Action {
  return {
    title: 'Export',
    action: () => showExportRecordsDialog(convention),
  }
}

export const SearchConventions: Action = {
  title: 'Search',
  action: navigate.searchConventions,
}
