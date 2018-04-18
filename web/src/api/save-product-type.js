/* @flow */
import type { Observable } from 'rxjs/Observable'
import type { Response } from './index'
import { of } from 'rxjs/observable/of'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
// $FlowIgnore: trouble importing graphql files
import mutation from './graphql/mutation/add-product-type.graphql'
import { parse } from '../model/product-type'
import type { AddProductTypeMutationVariables as Variables, AddProductTypeMutation as Value } from './schema'

import type { EditableProductType } from '../content/edit-products/schema'

export class SaveProductType extends GraphQLMutation<Variables, Value, EditableProductType, EditableProductType> {
  constructor() {
    super(mutation)
  }

  send(productType: EditableProductType): Observable<Response<EditableProductType, string>> {
    const { productType: original } = productType;
    if (original) {
      if (productType.name === original.name && productType.color === original.color && productType.discontinued === original.discontinued) {
        return of({ state: 'retrieved', value: productType })
      } else {
        // TODO: save. will require changing API classes again...
        return of({ state: 'retrieved', value: productType })
      }
    } else {
      const variables = {
        productType: {
          name: productType.name,
          color: productType.color || 0xffffff,
        }
      }
      return this._send(variables)
        .pipe(
          map(response => response.state === 'retrieved'
            ? { state: 'retrieved', value: { ...parse(response.value.addUserProductType), productType } }
            : response
          )
        )
    }
  }
}
