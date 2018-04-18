/* @flow */
import type { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { map } from 'rxjs/operators'

import { parse } from '../model/product'
import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type { AddProductMutationVariables, AddProductMutation } from './schema'
import type { EditableProduct } from '../content/edit-products/schema'

// $FlowIgnore: trouble importing graphql files
import addProduct from './graphql/mutation/add-product.graphql'

export class SaveProduct implements APIRequest<EditableProduct, EditableProduct> {
  addProduct: GraphQLMutation<AddProductMutationVariables, AddProductMutation>

  constructor() {
    this.addProduct = new GraphQLMutation(addProduct)
  }

  send(product: EditableProduct): Observable<Response<EditableProduct, string>> {
    const { product: original } = product;
    if (original) {
      if (product.name === original.name && product.quantity === original.quantity && product.discontinued === original.discontinued) {
        return of({ state: 'retrieved', value: product })
      } else {
        // TODO: save
        return of({ state: 'retrieved', value: product })
      }
    } else if (typeof product.typeId === 'number') {
      const variables = {
        product: {
          typeId: product.typeId,
          name: product.name,
          quantity: product.quantity,
        }
      }
      return this.addProduct.send(variables)
        .pipe(
          map(response => response.state === 'retrieved'
            ? { state: 'retrieved', value: { ...parse(response.value.addUserProduct), product } }
            : response
          )
        )
    } else {
      return of({ state: 'failed', error: 'The new product\'s typeId is not resolved to a server type' })
    }
  }
}
