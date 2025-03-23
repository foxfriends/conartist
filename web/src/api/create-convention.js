/*       */

import { map } from "rxjs/operators";

import { GraphQLMutation } from "./index";

// $FlowIgnore: trouble importing graphql files
import createConvention from "./graphql/mutation/create-convention.graphql";

export class CreateConvention {
  createConvention;

  constructor() {
    this.createConvention = new GraphQLMutation(createConvention);
  }

  send(variables) {
    return this.createConvention
      .send(variables)
      .pipe(
        map((response) =>
          response.state === "retrieved"
            ? { state: "retrieved", value: response.value.createConvention.id }
            : response,
        ),
      );
  }
}
