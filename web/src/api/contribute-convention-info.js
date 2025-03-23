/*       */

import { from } from "rxjs";
import { map, flatMap } from "rxjs/operators";

import { GraphQLMutation } from "./index";
import { parse } from "../model/convention-user-info";

export class ContributeConventionInfo {
  contributeConventionInfo;

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const contributeConventionInfo = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/contribute-convention-info.graphql"
    );
    this.contributeConventionInfo = contributeConventionInfo.then(
      (contributeConventionInfo) =>
        new GraphQLMutation(contributeConventionInfo.default),
    );
  }

  send(variables) {
    return from(this.contributeConventionInfo).pipe(
      flatMap((req) => req.send(variables)),
      map((response) =>
        response.state === "retrieved"
          ? {
              state: "retrieved",
              value: parse(response.value.addConventionInfo),
            }
          : response,
      ),
    );
  }
}
