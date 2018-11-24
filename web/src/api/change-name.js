/* @flow */
import type { Observable } from 'rxjs/Observable'
import { from } from 'rxjs';
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/user'
import type { User } from '../model/user'
import type { Response, APIRequest, APIError } from './index'
import type {
  ChangeName as ChangeNameMutation,
  ChangeNameVariables,
} from './schema'

export class ChangeName implements APIRequest<ChangeNameVariables, User> {
  changeName: GraphQLMutation<ChangeNameVariables, ChangeNameMutation>

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const changeName = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/change-name.graphql')
    this.changeName = changeName.then(changeName => new GraphQLMutation(changeName))
  }

  send(variables: ChangeNameVariables): Observable<Response<User, string>> {
    return from(this.changeName)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.changeUserName) }
          : response
        )
      )
  }
}
