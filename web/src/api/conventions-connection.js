/*       */

import { map } from "rxjs/operators";

import { GraphQLQuery } from "./index";

import { parse } from "../model/meta-convention";

// $FlowIgnore: trouble importing graphql files
import conventionsConnection from "./graphql/query/conventions-connection.graphql";

export class ConventionsConnection {
  conventionsConnection;

  constructor() {
    this.conventionsConnection = new GraphQLQuery(conventionsConnection);
  }

  send({ search, after } = {}) {
    return this.conventionsConnection
      .send({ search: search || null, after: after || null })
      .pipe(
        map((response) =>
          response.state === "retrieved"
            ? {
                state: "retrieved",
                value: {
                  nodes: response.value.conventionsConnection.nodes.map(parse),
                  endCursor: response.value.conventionsConnection.endCursor,
                  totalNodes: response.value.conventionsConnection.totalNodes,
                },
              }
            : response,
        ),
      );
  }
}
