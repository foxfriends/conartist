/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/meta-convention'
import type { MetaConvention } from '../model/meta-convention'
import type { Response, APIRequest, APIError } from './index'
import type {
  AddUserConventionMutation,
  AddUserConventionMutationVariables,
} from './schema'

// $FlowIgnore: trouble importing graphql files
import addUserConvention from './graphql/mutation/add-user-convention.graphql'

export class StarConvention implements APIRequest<AddUserConventionMutationVariables, MetaConvention> {
  addUserConvention: GraphQLMutation<AddUserConventionMutationVariables, AddUserConventionMutation>

  constructor() {
    this.addUserConvention = new GraphQLMutation(addUserConvention)
  }

  send(variables: AddUserConventionMutationVariables): Observable<Response<MetaConvention, string>> {
    return this.addUserConvention.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.addUserConvention) }
          : response
        )
      )
  }
}
