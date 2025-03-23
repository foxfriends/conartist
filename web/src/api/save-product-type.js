import { of, from } from "rxjs";
import { map, flatMap } from "rxjs/operators";

import { parse } from "../model/product-type";
import { GraphQLMutation } from "./index";

export class SaveProductType {
  constructor() {
    const addProductType = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/add-product-type.graphql"
    );
    const modProductType = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/mod-product-type.graphql"
    );
    const deleteProductType = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/delete-product-type.graphql"
    );
    this.addProductType = addProductType.then(
      (addProductType) => new GraphQLMutation(addProductType.default),
    );
    this.modProductType = modProductType.then(
      (modProductType) => new GraphQLMutation(modProductType.default),
    );
    this.deleteProductType = deleteProductType.then(
      (deleteProductType) => new GraphQLMutation(deleteProductType.default),
    );
  }

  send(productType) {
    const { productType: original } = productType;
    if (productType.deleted) {
      return from(this.deleteProductType).pipe(
        flatMap((req) => req.send({ typeId: productType.id })),
        map((response) =>
          response.state === "retrieved"
            ? { state: "retrieved", value: null }
            : response,
        ),
      );
    } else if (original && typeof productType.id === "number") {
      const variables = {
        productType: {
          typeId: productType.id,
        },
      };
      if (productType.name.trim() !== original.name) {
        variables.productType.name = productType.name.trim();
      }
      if (productType.color !== original.color) {
        variables.productType.color = productType.color;
      }
      if (productType.discontinued !== original.discontinued) {
        variables.productType.discontinued = productType.discontinued;
      }
      if (productType.sort !== original.sort) {
        variables.productType.sort = productType.sort;
      }
      if (Object.keys(variables.productType).length === 1) {
        // unmodified
        return of({ state: "retrieved", value: productType });
      } else {
        return from(this.modProductType).pipe(
          flatMap((req) => req.send(variables)),
          map((response) =>
            response.state === "retrieved"
              ? {
                  state: "retrieved",
                  value: {
                    ...parse(response.value.modUserProductType),
                    productType,
                  },
                }
              : response,
          ),
        );
      }
    } else {
      const variables = {
        productType: {
          name: productType.name.trim(),
          color: productType.color || 0xffffff,
          sort: productType.sort,
        },
      };
      return from(this.addProductType).pipe(
        flatMap((req) => req.send(variables)),
        map((response) =>
          response.state === "retrieved"
            ? {
                state: "retrieved",
                value: {
                  ...parse(response.value.addUserProductType),
                  productType,
                },
              }
            : response,
        ),
      );
    }
  }
}
