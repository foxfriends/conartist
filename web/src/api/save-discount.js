import { of, from } from "rxjs";
import { map, flatMap } from "rxjs/operators";

import { parse } from "../model/discount";
import { GraphQLMutation } from "./index";

export class SaveDiscount {
  addDiscount;
  deleteDiscount;

  constructor() {
    const addDiscount = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/add-discount.graphql"
    );
    const deleteDiscount = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/delete-discount.graphql"
    );
    this.addDiscount = addDiscount.then(
      (addDiscount) => new GraphQLMutation(addDiscount.default),
    );
    this.deleteDiscount = deleteDiscount.then(
      (deleteDiscount) => new GraphQLMutation(deleteDiscount.default),
    );
  }

  send(input) {
    const { operation, discount } = input;
    if (operation === "add") {
      const variables = {
        discount: {
          name: discount.name,
          appliesTo:
            discount.productTypeIds && discount.productTypeIds.length > 0
              ? "PRODUCT_TYPES"
              : discount.productIds && discount.productIds.length > 0
                ? "PRODUCTS"
                : "ALL",
          appliesToIds:
            discount.productTypeIds && discount.productTypeIds.length > 0
              ? discount.productTypeIds
              : discount.productIds && discount.productIds.length > 0
                ? discount.productIds
                : null,
          flatAmount: discount.flatAmount ? discount.flatAmount.toJSON() : null,
          percentageAmount: discount.percentageAmount,
        },
      };
      return from(this.addDiscount).pipe(
        flatMap((req) => req.send(variables)),
        map((response) =>
          response.state === "retrieved"
            ? {
                state: "retrieved",
                value: parse(response.value.addUserDiscount),
              }
            : response,
        ),
      );
    } else if (operation === "delete") {
      const variables = { discountId: discount.discountId };
      return from(this.deleteDiscount).pipe(
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
