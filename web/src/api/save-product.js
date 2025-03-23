import { of, from } from "rxjs";
import { map, flatMap } from "rxjs/operators";

import { parse } from "../model/product";
import { GraphQLMutation } from "./index";

export class SaveProduct {
  constructor() {
    const addProduct = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/add-product.graphql"
    );
    const modProduct = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/mod-product.graphql"
    );
    const deleteProduct = import(
      /* webpackChunkName: 'mutations' */ "./graphql/mutation/delete-product.graphql"
    );
    this.addProduct = addProduct.then(
      (addProduct) => new GraphQLMutation(addProduct.default),
    );
    this.modProduct = modProduct.then(
      (modProduct) => new GraphQLMutation(modProduct.default),
    );
    this.deleteProduct = deleteProduct.then(
      (deleteProduct) => new GraphQLMutation(deleteProduct.default),
    );
  }

  send(product) {
    const { product: original } = product;
    if (product.deleted) {
      return from(this.deleteProduct).pipe(
        flatMap((req) => req.send({ productId: product.id })),
        map((response) =>
          response.state === "retrieved"
            ? { state: "retrieved", value: null }
            : response,
        ),
      );
    } else if (original && typeof product.id === "number") {
      const variables = {
        product: {
          productId: product.id,
        },
      };
      if (product.name.trim() !== original.name) {
        variables.product.name = product.name.trim();
      }
      if (product.quantity !== original.quantity) {
        variables.product.quantity = product.quantity;
      }
      if (product.discontinued !== original.discontinued) {
        variables.product.discontinued = product.discontinued;
      }
      if (product.sort !== original.sort) {
        variables.product.sort = product.sort;
      }
      if (product.sku !== original.sku) {
        variables.product.sku = product.sku;
      }
      if (Object.keys(variables.product).length === 1) {
        // Unmodified
        // $FlowIgnore: We just confirmed original is a Product
        return of({ state: "retrieved", value: original });
      } else {
        return from(this.modProduct).pipe(
          flatMap((req) => req.send(variables)),
          map((response) =>
            response.state === "retrieved"
              ? {
                  state: "retrieved",
                  value: parse(response.value.modUserProduct),
                }
              : response,
          ),
        );
      }
    } else if (typeof product.typeId === "number") {
      const variables = {
        product: {
          typeId: product.typeId,
          name: product.name.trim(),
          quantity: product.quantity,
          sort: product.sort,
          sku: product.sku,
        },
      };
      return from(this.addProduct).pipe(
        flatMap((req) => req.send(variables)),
        map((response) =>
          response.state === "retrieved"
            ? {
                state: "retrieved",
                value: parse(response.value.addUserProduct),
              }
            : response,
        ),
      );
    } else {
      return of({
        state: "failed",
        error: "The new product's typeId is not resolved to a server type",
      });
    }
  }
}
