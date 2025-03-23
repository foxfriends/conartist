/*       */

import { from } from "rxjs";
import { map } from "rxjs/operators";

import { GraphQLQuery } from "./index";

import recordsConnection from "./graphql/query/records-connection.graphql";

import { parse } from "../model/record";

export class RecordsConnection {
  recordsConnection;

  constructor() {
    this.recordsConnection = new GraphQLQuery(recordsConnection);
  }

  send({ before } = {}) {
    return this.recordsConnection.send({ before }).pipe(
      map((response) =>
        response.state === "retrieved"
          ? {
              state: "retrieved",
              value: {
                nodes: response.value.recordsConnection.nodes.map(parse),
                endCursor: response.value.recordsConnection.endCursor,
                totalNodes: response.value.recordsConnection.totalNodes,
              },
            }
          : response,
      ),
    );
  }
}
