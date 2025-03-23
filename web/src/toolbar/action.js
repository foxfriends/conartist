/*       */
import { showSignupDialog, showSigninDialog } from "../update/splash";
import {
  showNewSaleDialog,
  showCreateSuggestionDialog,
  showExportProductsDialog,
  showExportRecordsDialog,
  showImportProductsDialog,
} from "../update/dialog";
import * as navigate from "../update/navigate";
import {
  send,
  SaveProducts as SaveProductsEvent,
  SavePrices as SavePricesEvent,
} from "../event";

export const LogIn = {
  title: "Sign in",
  action: showSigninDialog,
};

export const NewSale = {
  title: "New Sale",
  action: () => showNewSaleDialog(),
};

export const SignUp = {
  title: "Sign up",
  action: showSignupDialog,
};

export const EditProducts = {
  title: "Edit",
  action: navigate.editProducts,
};

export const ExportProducts = {
  title: "Export",
  action: showExportProductsDialog,
};

export const ImportProducts = {
  title: "Import",
  action: showImportProductsDialog,
};

export const DiscardProducts = {
  title: "Discard",
  action: navigate.products,
};

export const SaveProducts = {
  title: "Save",
  action: () => send(SaveProductsEvent),
};

export const EditPrices = {
  title: "Edit",
  action: navigate.editPrices,
};

export const DiscardPrices = {
  title: "Discard",
  action: navigate.prices,
};

export const CreateSuggestion = {
  title: "Make a suggestion",
  action: showCreateSuggestionDialog,
};

export const SavePrices = {
  title: "Save",
  action: () => send(SavePricesEvent),
};

export function ExportRecords(convention) {
  return {
    title: "Export",
    action: () => showExportRecordsDialog(convention),
  };
}

export const SearchConventions = {
  title: "Search",
  action: navigate.searchConventions,
};
