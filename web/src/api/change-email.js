/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/user'
import type { User } from '../model/user'
import type { Response, APIRequest, APIError } from './index'
import type {
  ChangeEmail as ChangeEmailMutation,
  ChangeEmailVariables,
} from './schema'

// $FlowIgnore: trouble importing graphql files
import changeEmail from './graphql/mutation/change-email.graphql'

export class ChangeEmail implements APIRequest<ChangeEmailVariables, User> {
  changeEmail: GraphQLMutation<ChangeEmailVariables, ChangeEmailMutation>

  constructor() {
    this.changeEmail = new GraphQLMutation(changeEmail)
  }

  send(variables: ChangeEmailVariables): Observable<Response<User, string>> {
    return this.changeEmail.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.changeUserEmail) }
          : response
        )
      )
  }
}
