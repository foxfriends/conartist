/* @flow */
import type { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { map } from 'rxjs/operators'
import type { Response } from './index'

import { GraphQLMutation } from './index'
// $FlowIgnore: trouble importing graphql files
import mutation from './graphql/mutation/add-product.graphql'
import { parse } from '../model/product'
import type { AddProductMutationVariables as Variables, AddProductMutation as Value } from './schema'

import type { EditableProduct } from '../content/edit-products/schema'

export class SaveProduct extends GraphQLMutation<Variables, Value, EditableProduct, EditableProduct> {
  constructor() {
    super(mutation)
  }

  send(product: EditableProduct): Observable<Response<EditableProduct, string>> {
    const { product: original } = product;
    if (original) {
      if (product.name === original.name && product.quantity === original.quantity && product.discontinued === original.discontinued) {
        return of({ state: 'retrieved', value: product })
      } else {
        // TODO: save. will require changing API classes again...
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
      return this._send(variables)
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
