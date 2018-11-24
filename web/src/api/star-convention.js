/* @flow */
import type { Observable } from 'rxjs/Observable'
import { from } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/meta-convention'
import type { MetaConvention } from '../model/meta-convention'
import type { Response, APIRequest, APIError } from './index'
import type {
  AddUserConvention as AddUserConventionMutation,
  AddUserConventionVariables,
} from './schema'

export class StarConvention implements APIRequest<AddUserConventionVariables, MetaConvention> {
  addUserConvention: GraphQLMutation<AddUserConventionVariables, AddUserConventionMutation>

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const addUserConvention = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/add-user-convention.graphql')
    this.addUserConvention = addUserConvention.then(addUserConvention => new GraphQLMutation(addUserConvention))
  }

  send(variables: AddUserConventionVariables): Observable<Response<MetaConvention, string>> {
    return from(this.addUserConvention)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.addUserConvention) }
          : response
        )
      )
  }
}
