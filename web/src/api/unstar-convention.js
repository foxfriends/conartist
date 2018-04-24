/* @flow */
import type { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  DeleteUserConventionMutation,
  DeleteUserConventionMutationVariables,
} from './schema'

// $FlowIgnore: trouble importing graphql files
import delUserConvention from './graphql/mutation/delete-user-convention.graphql'

export class UnstarConvention implements APIRequest<DeleteUserConventionMutationVariables, void> {
  delUserConvention: GraphQLMutation<DeleteUserConventionMutationVariables, DeleteUserConventionMutation>

  constructor() {
    this.delUserConvention = new GraphQLMutation(delUserConvention)
  }

  send(variables: DeleteUserConventionMutationVariables): Observable<Response<void, string>> {
    return this.delUserConvention.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: null }
          : response
        )
      )
  }
}
