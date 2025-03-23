import { from } from "rxjs";
import { map, flatMap } from "rxjs/operators";

import { GraphQLMutation } from "./index";
import { parse } from "../model/meta-convention";

export class StarConvention {
  constructor() {
    const addUserConvention = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/add-user-convention.graphql"
    );
    this.addUserConvention = addUserConvention.then(
      (addUserConvention) => new GraphQLMutation(addUserConvention.default),
    );
  }

  send(variables) {
    return from(this.addUserConvention).pipe(
      flatMap((req) => req.send(variables)),
      map((response) =>
        response.state === "retrieved"
          ? {
              state: "retrieved",
              value: parse(response.value.addUserConvention),
            }
          : response,
      ),
    );
  }
}
