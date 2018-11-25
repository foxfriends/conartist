/* @flow */
import type { Observable } from 'rxjs/Observable'
import { from } from 'rxjs';
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/convention-user-info'
import type { Response, APIRequest, APIError } from './index'
import type {
  ContributeConventionInfo as ContributeConventionInfoMutation,
  ContributeConventionInfoVariables,
} from './schema'
import type { ConventionUserInfo } from '../model/convention-user-info'

export class ContributeConventionInfo implements APIRequest<ContributeConventionInfoVariables, ConventionUserInfo> {
  contributeConventionInfo: GraphQLMutation<ContributeConventionInfoVariables, ContributeConventionInfoMutation>

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const contributeConventionInfo = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/contribute-convention-info.graphql')
    this.contributeConventionInfo = contributeConventionInfo.then(contributeConventionInfo => new GraphQLMutation(contributeConventionInfo.default))
  }

  send(variables: ContributeConventionInfoVariables): Observable<Response<ConventionUserInfo, string>> {
    return from(this.contributeConventionInfo)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.addConventionInfo) }
          : response
        )
      )
  }
}
