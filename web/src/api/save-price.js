/*       */

import { of, from } from "rxjs";
import { map, flatMap } from "rxjs/operators";

import { parse } from "../model/price";
import { GraphQLMutation } from "./index";

export class SavePrice {
  addPrice;
  deletePrice;

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const addPrice = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/add-price.graphql"
    );
    // $FlowIgnore: trouble importing graphql files
    const deletePrice = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/delete-price.graphql"
    );
    this.addPrice = addPrice.then(
      (addPrice) => new GraphQLMutation(addPrice.default),
    );
    this.deletePrice = deletePrice.then(
      (deletePrice) => new GraphQLMutation(deletePrice.default),
    );
  }

  send(input) {
    const { operation, price } = input;
    if (operation === "add") {
      const variables = {
        price: {
          typeId: price.typeId,
          productId: price.productId,
          quantity: price.quantity,
          price: price.price.toJSON(),
        },
      };
      return from(this.addPrice).pipe(
        flatMap((req) => req.send(variables)),
        map((response) =>
          response.state === "retrieved"
            ? { state: "retrieved", value: parse(response.value.addUserPrice) }
            : response,
        ),
      );
    } else if (operation === "delete") {
      const variables = {
        price: {
          typeId: price.typeId,
          productId: price.productId,
          quantity: price.quantity,
        },
      };
      return from(this.deletePrice).pipe(
        flatMap((req) => req.send(variables)),
        map((response) =>
          response.state === "retrieved"
            ? { state: "retrieved", value: null }
            : response,
        ),
      );
    } else {
      return of({ state: "failed", error: `Unknown operation ${operation}` });
    }
  }
}
