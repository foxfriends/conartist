/* @flow */
import type { Observable } from 'rxjs/Observable'
import { from } from 'rxjs';
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/user'
import type { User } from '../model/user'
import type { Response, APIRequest, APIError } from './index'
import type {
  ChangeEmail as ChangeEmailMutation,
  ChangeEmailVariables,
} from './schema'

export class ChangeEmail implements APIRequest<ChangeEmailVariables, User> {
  changeEmail: GraphQLMutation<ChangeEmailVariables, ChangeEmailMutation>

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const changeEmail = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/change-email.graphql')
    this.changeEmail = changeEmail.then(changeEmail => new GraphQLMutation(changeEmail.default))
  }

  send(variables: ChangeEmailVariables): Observable<Response<User, string>> {
    return from(this.changeEmail)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.changeUserEmail) }
          : response
        )
      )
  }
}
