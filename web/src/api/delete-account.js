import { from } from "rxjs";
import { map, flatMap } from "rxjs/operators";

import { GraphQLMutation } from "./index";
import { parse } from "../model/user";

export class DeleteAccount {
  deleteAccount;

  constructor() {
    const deleteAccount = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/delete-account.graphql"
    );
    this.deleteAccount = deleteAccount.then(
      (deleteAccount) => new GraphQLMutation(deleteAccount.default),
    );
  }

  send(variables) {
    return from(this.deleteAccount).pipe(
      flatMap((req) => req.send(variables)),
      map((response) =>
        response.state === "retrieved"
          ? {
              state: "retrieved",
              value: response.value.deleteAccount,
            }
          : response,
      ),
    );
  }
}
