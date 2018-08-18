/* @flow */
import type { Observable } from 'rxjs'
import { of } from 'rxjs'
import { map } from 'rxjs/operators'

import { parse } from '../model/price'
import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  AddPriceMutation,
  AddPriceMutationVariables,
  DeletePriceMutation,
  DeletePriceMutationVariables,
} from './schema'
import type { Price } from '../model/price'

// $FlowIgnore: trouble importing graphql files
import addPrice from './graphql/mutation/add-price.graphql'
// $FlowIgnore: trouble importing graphql files
import deletePrice from './graphql/mutation/delete-price.graphql'

export type Add = { operation: 'add', price: Price }
export type Delete = { operation: 'delete', price: Price }

export class SavePrice implements APIRequest<Add | Delete, ?Price> {
  addPrice: GraphQLMutation<AddPriceMutationVariables, AddPriceMutation>
  deletePrice: GraphQLMutation<DeletePriceMutationVariables, DeletePriceMutation>

  constructor() {
    this.addPrice = new GraphQLMutation(addPrice)
    this.deletePrice = new GraphQLMutation(deletePrice)
  }

  send(input: Add | Delete): Observable<Response<?Price, string>> {
    const { operation, price } = input;
    if (operation === 'add') {
      const variables: AddPriceMutationVariables = {
        price: {
          typeId: price.typeId,
          productId: price.productId,
          quantity: price.quantity,
          price: price.price.toJSON(),
        }
      }
      return this.addPrice.send(variables)
        .pipe(
          map(response => response.state === 'retrieved'
            ? { state: 'retrieved', value: parse(response.value.addUserPrice) }
            : response
          )
        )
    } else if (operation === 'delete') {
      const variables: DeletePriceMutationVariables = {
        price: {
          typeId: price.typeId,
          productId: price.productId,
          quantity: price.quantity,
        }
      }
      return this.deletePrice.send(variables)
        .pipe(
          map(response => response.state === 'retrieved'
            ? { state: 'retrieved', value: null }
            : response
          )
        )
    } else {
      return of({ state: 'failed', error: `Unknown operation ${operation}` })
    }
  }
}
