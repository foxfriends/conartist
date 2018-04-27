/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/convention-user-info'
import type { Response, APIRequest, APIError } from './index'
import type {
  ContributeConventionInfoMutation,
  ContributeConventionInfoMutationVariables,
} from './schema'
import type { ConventionUserInfo } from '../model/convention-user-info'

// $FlowIgnore: trouble importing graphql files
import contributeConventionInfo from './graphql/mutation/contribute-convention-info.graphql'

export class ContributeConventionInfo implements APIRequest<ContributeConventionInfoMutationVariables, ConventionUserInfo> {
  contributeConventionInfo: GraphQLMutation<ContributeConventionInfoMutationVariables, ContributeConventionInfoMutation>

  constructor() {
    this.contributeConventionInfo = new GraphQLMutation(contributeConventionInfo)
  }

  send(variables: ContributeConventionInfoMutationVariables): Observable<Response<ConventionUserInfo, string>> {
    return this.contributeConventionInfo.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.addConventionInfo) }
          : response
        )
      )
  }
}
