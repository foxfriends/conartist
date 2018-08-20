/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  AddConventionInfo as AddConventionInfoMutation,
  AddConventionInfoVariables,
} from './schema'

// $FlowIgnore: trouble importing graphql files
import addConventionInfo from './graphql/mutation/add-convention-info.graphql'

// Admin use only, for adding convention extra info
export class AddConventionInfo implements APIRequest<AddConventionInfoVariables, null> {
  addConventionInfo: GraphQLMutation<AddConventionInfoVariables, AddConventionInfoMutation>

  constructor() {
    this.addConventionInfo = new GraphQLMutation(addConventionInfo)
  }

  send(variables: AddConventionInfoVariables): Observable<Response<null, string>> {
    return this.addConventionInfo.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: null }
          : response
        )
      )
  }
}
