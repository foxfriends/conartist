/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  DeleteUserConvention as DeleteUserConventionMutation,
  DeleteUserConventionVariables,
} from './schema'

// $FlowIgnore: trouble importing graphql files
import delUserConvention from './graphql/mutation/delete-user-convention.graphql'

export class UnstarConvention implements APIRequest<DeleteUserConventionVariables, null> {
  delUserConvention: GraphQLMutation<DeleteUserConventionVariables, DeleteUserConventionMutation>

  constructor() {
    this.delUserConvention = new GraphQLMutation(delUserConvention)
  }

  send(variables: DeleteUserConventionVariables): Observable<Response<null, string>> {
    return this.delUserConvention.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: null }
          : response
        )
      )
  }
}
