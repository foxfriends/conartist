/* @flow */
import type { Observable } from 'rxjs'
import { of, from } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'

import { parse } from '../model/product-type'
import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  AddProductTypeVariables,
  AddProductType as AddProductTypeMutation,
  ModProductTypeVariables,
  ModProductType as ModProductTypeMutation,
} from './schema'
import type { EditableProductType } from '../content/edit-products/schema'

export class SaveProductType implements APIRequest<EditableProductType, $Diff<EditableProductType, { validation: any }>> {
  addProductType: GraphQLMutation<AddProductTypeVariables, AddProductTypeMutation>
  modProductType: GraphQLMutation<ModProductTypeVariables, ModProductTypeMutation>

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const addProductType = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/add-product-type.graphql')
    // $FlowIgnore: trouble importing graphql files
    const modProductType = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/mod-product-type.graphql')
    this.addProductType = addProductType.then(addProductType => new GraphQLMutation(addProductType.default))
    this.modProductType = modProductType.then(modProductType => new GraphQLMutation(modProductType.default))
  }

  send(productType: EditableProductType): Observable<Response<$Diff<EditableProductType, { validation: any }>, APIError>> {
    const { productType: original } = productType;
    if (original && typeof productType.id === 'number') {
      const variables: ModProductTypeVariables = {
        productType: {
          typeId: productType.id
        }
      };
      if (productType.name !== original.name) {
        variables.productType.name = productType.name
      }
      if (productType.color !== original.color) {
        variables.productType.color = productType.color
      }
      if (productType.discontinued !== original.discontinued) {
        variables.productType.discontinued = productType.discontinued
      }
      if (productType.sort !== original.sort) {
        variables.productType.sort = productType.sort
      }
      if (Object.keys(variables.productType).length === 1) {
        // unmodified
        return of({ state: 'retrieved', value: productType })
      } else {
        return from(this.modProductType)
          .pipe(
            flatMap(req => req.send(variables)),
            map(response => response.state === 'retrieved'
              ? { state: 'retrieved', value: { ...parse(response.value.modUserProductType), productType } }
              : response
            )
          )
      }
    } else {
      const variables: AddProductTypeVariables = {
        productType: {
          name: productType.name,
          color: productType.color || 0xffffff,
          sort: productType.sort,
        }
      }
      return from(this.addProductType)
        .pipe(
          flatMap(req => req.send(variables)),
          map(response => response.state === 'retrieved'
            ? { state: 'retrieved', value: { ...parse(response.value.addUserProductType), productType } }
            : response
          )
        )
    }
  }
}
