/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/user'
import type { User } from '../model/user'
import type { Response, APIRequest, APIError } from './index'
import type {
  ChangeName as ChangeNameMutation,
  ChangeNameVariables,
} from './schema'

// $FlowIgnore: trouble importing graphql files
import changeName from './graphql/mutation/change-name.graphql'

export class ChangeName implements APIRequest<ChangeNameVariables, User> {
  changeName: GraphQLMutation<ChangeNameVariables, ChangeNameMutation>

  constructor() {
    this.changeName = new GraphQLMutation(changeName)
  }

  send(variables: ChangeNameVariables): Observable<Response<User, string>> {
    return this.changeName.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.changeUserName) }
          : response
        )
      )
  }
}
