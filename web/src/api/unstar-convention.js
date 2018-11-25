/* @flow */
import type { Observable } from 'rxjs/Observable'
import { from } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  DeleteUserConvention as DeleteUserConventionMutation,
  DeleteUserConventionVariables,
} from './schema'

export class UnstarConvention implements APIRequest<DeleteUserConventionVariables, null> {
  delUserConvention: GraphQLMutation<DeleteUserConventionVariables, DeleteUserConventionMutation>

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const delUserConvention = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/delete-user-convention.graphql')
    this.delUserConvention = delUserConvention.then(delUserConvention => new GraphQLMutation(delUserConvention.default))
  }

  send(variables: DeleteUserConventionVariables): Observable<Response<null, string>> {
    return from(this.delUserConvention)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: null }
          : response
        )
      )
  }
}
