/*       */
import * as React from "react";
import { BehaviorSubject } from "rxjs";

import { Storage } from "../storage";
import { splash, dashboard } from "./page";
import { empty } from "./connection";
import { ReauthorizeRequest } from "../api/reauthorize";
import * as toast from "../toast";
import { setUser } from "../update/signin";
import { signOut } from "../update/settings";
import { resolveRoute } from "../routing";
import { l } from "../localization";
import { PAGE_NO_AUTH } from "../constants";

export const defaultModel = {
  user: null,
  prices: [],
  productTypes: [],
  products: [],
  conventions: [],
  records: empty(),
  page: splash,
  dialog: null,
  suggestions: empty(),
  settings: {
    language: Storage.retrieve(Storage.Language) || "en-ca",
    currency: "CAD",
  },
};

function init() {
  const page = resolveRoute();
  if (!PAGE_NO_AUTH.includes(page.name)) {
    new ReauthorizeRequest().send().subscribe((response) => {
      switch (response.state) {
        case "failed":
          if (response.shouldLogOut) {
            toast.show(<>{l`Uh oh. You have been logged out!`}</>);
            signOut();
          }
          break;
        case "retrieved":
          setUser(response.value);
      }
    });
  }
  // $FlowIgnore: not good enough at spread
  return {
    ...defaultModel,
    page,
  };
}

export const model = new BehaviorSubject(init());
