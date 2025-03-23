/*       */

import { from } from "rxjs";
import { map, flatMap } from "rxjs/operators";

import { GraphQLMutation } from "./index";

export class UnstarConvention {
  delUserConvention;

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const delUserConvention = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/delete-user-convention.graphql"
    );
    this.delUserConvention = delUserConvention.then(
      (delUserConvention) => new GraphQLMutation(delUserConvention.default),
    );
  }

  send(variables) {
    return from(this.delUserConvention).pipe(
      flatMap((req) => req.send(variables)),
      map((response) =>
        response.state === "retrieved"
          ? { state: "retrieved", value: null }
          : response,
      ),
    );
  }
}
