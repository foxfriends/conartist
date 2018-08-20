/* @flow */
import type { Observable } from 'rxjs'
import { of } from 'rxjs'
import { map } from 'rxjs/operators'

import { parse } from '../model/product'
import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  AddProductVariables,
  AddProduct as AddProductMutation,
  ModProductVariables,
  ModProduct as ModProductMutation,
} from './schema'
import type { Product } from '../model/product'
import type { EditableProduct } from '../content/edit-products/schema'

// $FlowIgnore: trouble importing graphql files
import addProduct from './graphql/mutation/add-product.graphql'
// $FlowIgnore: trouble importing graphql files
import modProduct from './graphql/mutation/mod-product.graphql'

export class SaveProduct implements APIRequest<EditableProduct, Product> {
  addProduct: GraphQLMutation<AddProductVariables, AddProductMutation>
  modProduct: GraphQLMutation<ModProductVariables, ModProductMutation>

  constructor() {
    this.addProduct = new GraphQLMutation(addProduct)
    this.modProduct = new GraphQLMutation(modProduct)
  }

  send(product: EditableProduct): Observable<Response<Product, string>> {
    const { product: original } = product;
    if (original && typeof product.id === 'number') {
      const variables: ModProductVariables = {
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
      if (product.sort !== original.sort) {
        variables.product.sort = product.sort
      }
      if (Object.keys(variables.product).length === 1) {
        // Unmodified
        // $FlowIgnore: We just confirmed original is a Product
        return of({ state: 'retrieved', value: original })
      } else {
        // TODO: save
        return this.modProduct.send(variables)
          .pipe(
            map(response => response.state === 'retrieved'
              ? { state: 'retrieved', value: parse(response.value.modUserProduct) }
              : response
            )
          )
      }
    } else if (typeof product.typeId === 'number') {
      const variables: AddProductVariables = {
        product: {
          typeId: product.typeId,
          name: product.name,
          quantity: product.quantity,
          sort: product.sort,
        }
      }
      return this.addProduct.send(variables)
        .pipe(
          map(response => response.state === 'retrieved'
            ? { state: 'retrieved', value: parse(response.value.addUserProduct) }
            : response
          )
        )
    } else {
      return of({ state: 'failed', error: 'The new product\'s typeId is not resolved to a server type' })
    }
  }
}
