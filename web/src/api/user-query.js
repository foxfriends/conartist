/*       */

import { map } from "rxjs/operators";

import { GraphQLQuery } from "./index";
// $FlowIgnore: trouble importing graphql files
import query from "./graphql/query/full-user.graphql";
import { parse } from "../model/user";

export class UserQuery {
  query;

  constructor() {
    this.query = new GraphQLQuery(query);
  }

  send(variables = { id: null }) {
    return this.query
      .send(variables)
      .pipe(
        map((response) =>
          response.state === "retrieved"
            ? { state: "retrieved", value: parse(response.value.user) }
            : response,
        ),
      );
  }
}
