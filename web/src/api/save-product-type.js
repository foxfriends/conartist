/* @flow */
import type { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { map } from 'rxjs/operators'

import { parse } from '../model/product-type'
import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type { AddProductTypeMutationVariables, AddProductTypeMutation } from './schema'
import type { EditableProductType } from '../content/edit-products/schema'

// $FlowIgnore: trouble importing graphql files
import addProductType from './graphql/mutation/add-product-type.graphql'

export class SaveProductType implements APIRequest<EditableProductType, EditableProductType> {
  addProductType: GraphQLMutation<AddProductTypeMutationVariables, AddProductTypeMutation>

  constructor() {
    this.addProductType = new GraphQLMutation(addProductType)
  }

  send(productType: EditableProductType): Observable<Response<EditableProductType, APIError>> {
    const { productType: original } = productType;
    if (original) {
      if (productType.name === original.name && productType.color === original.color && productType.discontinued === original.discontinued) {
        return of({ state: 'retrieved', value: productType })
      } else {
        // TODO: save
        return of({ state: 'retrieved', value: productType })
      }
    } else {
      const variables = {
        productType: {
          name: productType.name,
          color: productType.color || 0xffffff,
        }
      }
      return this.addProductType.send(variables)
        .pipe(
          map(response => response.state === 'retrieved'
            ? { state: 'retrieved', value: { ...parse(response.value.addUserProductType), productType } }
            : response
          )
        )
    }
  }
}
