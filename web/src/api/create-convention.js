/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  CreateConventionMutation,
  CreateConventionMutationVariables,
} from './schema'

// $FlowIgnore: trouble importing graphql files
import createConvention from './graphql/mutation/create-convention.graphql'

export class CreateConvention implements APIRequest<CreateConventionMutationVariables, number> {
  createConvention: GraphQLMutation<CreateConventionMutationVariables, CreateConventionMutation>

  constructor() {
    this.createConvention = new GraphQLMutation(createConvention)
  }

  send(variables: CreateConventionMutationVariables): Observable<Response<number, string>> {
    return this.createConvention.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: response.value.createConvention.id }
          : response
        )
      )
  }
}
