/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/convention-user-info'
import type { Response, APIRequest, APIError } from './index'
import type {
  ContributeConventionInfo as ContributeConventionInfoMutation,
  ContributeConventionInfoVariables,
} from './schema'
import type { ConventionUserInfo } from '../model/convention-user-info'

// $FlowIgnore: trouble importing graphql files
import contributeConventionInfo from './graphql/mutation/contribute-convention-info.graphql'

export class ContributeConventionInfo implements APIRequest<ContributeConventionInfoVariables, ConventionUserInfo> {
  contributeConventionInfo: GraphQLMutation<ContributeConventionInfoVariables, ContributeConventionInfoMutation>

  constructor() {
    this.contributeConventionInfo = new GraphQLMutation(contributeConventionInfo)
  }

  send(variables: ContributeConventionInfoVariables): Observable<Response<ConventionUserInfo, string>> {
    return this.contributeConventionInfo.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.addConventionInfo) }
          : response
        )
      )
  }
}
