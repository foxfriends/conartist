/* @flow */
import type { Observable } from 'rxjs'
import { of, from } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'

import { parse } from '../model/price'
import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  AddPrice as AddPriceMutation,
  AddPriceVariables,
  DeletePrice as DeletePriceMutation,
  DeletePriceVariables,
} from './schema'
import type { Price } from '../model/price'

export type Add = { operation: 'add', price: Price }
export type Delete = { operation: 'delete', price: Price }

export class SavePrice implements APIRequest<Add | Delete, ?Price> {
  addPrice: GraphQLMutation<AddPriceVariables, AddPriceMutation>
  deletePrice: GraphQLMutation<DeletePriceVariables, DeletePriceMutation>

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const addPrice = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/add-price.graphql')
    // $FlowIgnore: trouble importing graphql files
    const deletePrice = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/delete-price.graphql')
    this.addPrice = addPrice.then(addPrice => new GraphQLMutation(addPrice))
    this.deletePrice = deletePrice.then(deletePrice => new GraphQLMutation(deletePrice))
  }

  send(input: Add | Delete): Observable<Response<?Price, string>> {
    const { operation, price } = input;
    if (operation === 'add') {
      const variables: AddPriceVariables = {
        price: {
          typeId: price.typeId,
          productId: price.productId,
          quantity: price.quantity,
          price: price.price.toJSON(),
        }
      }
      return from(this.addPrice)
        .pipe(
          flatMap(req => req.send(variables)),
          map(response => response.state === 'retrieved'
            ? { state: 'retrieved', value: parse(response.value.addUserPrice) }
            : response
          )
        )
    } else if (operation === 'delete') {
      const variables: DeletePriceVariables = {
        price: {
          typeId: price.typeId,
          productId: price.productId,
          quantity: price.quantity,
        }
      }
      return from(this.deletePrice)
        .pipe(
          flatMap(req => req.send(variables)),
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
