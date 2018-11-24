/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/user'
import type { Response, APIRequest, APIError } from './index'
import type {
  ChangeLanguage as ChangeLanguageMutation,
  ChangeLanguageVariables,
} from './schema'

// $FlowIgnore: trouble importing graphql files
import changeLanguage from './graphql/mutation/update-language.graphql'

export class ChangeLanguage implements APIRequest<ChangeLanguageVariables, String> {
  changeLanguage: GraphQLMutation<ChangeLanguageVariables, ChangeLanguageMutation>

  constructor() {
    this.changeLanguage = new GraphQLMutation(changeLanguage)
  }

  send(variables: ChangeLanguageVariables): Observable<Response<User, string>> {
    return this.changeLanguage.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: response.value.updateSettings.language }
          : response
        )
      )
  }
}
