/* @flow */
import type { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  AddConventionInfoMutation,
  AddConventionInfoMutationVariables,
} from './schema'

// $FlowIgnore: trouble importing graphql files
import addConventionInfo from './graphql/mutation/add-convention-info.graphql'

export class AddConventionInfo implements APIRequest<AddConventionInfoMutationVariables, void> {
  addConventionInfo: GraphQLMutation<AddConventionInfoMutationVariables, AddConventionInfoMutation>

  constructor() {
    this.addConventionInfo = new GraphQLMutation(addConventionInfo)
  }

  send(variables: AddConventionInfoMutationVariables): Observable<Response<void, string>> {
    return this.addConventionInfo.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: null }
          : response
        )
      )
  }
}
