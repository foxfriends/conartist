/* @flow */
import type { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { map } from 'rxjs/operators'

import { parse } from '../model/product'
import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  AddProductMutationVariables,
  AddProductMutation,
  ModProductMutationVariables,
  ModProductMutation,
} from './schema'
import type { EditableProduct } from '../content/edit-products/schema'

// $FlowIgnore: trouble importing graphql files
import addProduct from './graphql/mutation/add-product.graphql'
// $FlowIgnore: trouble importing graphql files
import modProduct from './graphql/mutation/mod-product.graphql'

export class SaveProduct implements APIRequest<EditableProduct, EditableProduct> {
  addProduct: GraphQLMutation<AddProductMutationVariables, AddProductMutation>
  modProduct: GraphQLMutation<ModProductMutationVariables, ModProductMutation>

  constructor() {
    this.addProduct = new GraphQLMutation(addProduct)
    this.modProduct = new GraphQLMutation(modProduct)
  }

  send(product: EditableProduct): Observable<Response<EditableProduct, string>> {
    const { product: original } = product;
    if (original) {
      const variables: ModProductMutationVariables = {
        product: {
          productId: product.id,
        }
      }
      if (product.name !== original.name) {
        variables.product.name = product.name
      }
      if (product.quantity !== original.quantity) {
        variables.product.quantity = product.quantity
      }
      if (product.discontinued !== original.discontinued) {
        variables.product.discontinued = product.discontinued
      }
      if (Object.keys(variables.product).length === 1) {
        // Unmodified
        return of({ state: 'retrieved', value: product })
      } else {
        // TODO: save
        return this.modProduct.send(variables)
          .pipe(
            map(response => response.state === 'retrieved'
              ? { state: 'retrieved', value: { ...parse(response.value.modUserProduct), product } }
              : response
            )
          )
      }
    } else if (typeof product.typeId === 'number') {
      const variables: AddProductMutationVariables = {
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
