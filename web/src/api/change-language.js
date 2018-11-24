/* @flow */
import type { Observable } from 'rxjs/Observable'
import { from } from 'rxjs';
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/user'
import type { Response, APIRequest, APIError } from './index'
import type {
  ChangeLanguage as ChangeLanguageMutation,
  ChangeLanguageVariables,
} from './schema'

export class ChangeLanguage implements APIRequest<ChangeLanguageVariables, String> {
  changeLanguage: GraphQLMutation<ChangeLanguageVariables, ChangeLanguageMutation>

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const changeLanguage = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/update-language.graphql')
    this.changeLanguage = changeLanguage.then(changeLanguage => new GraphQLMutation(changeLanguage))
  }

  send(variables: ChangeLanguageVariables): Observable<Response<User, string>> {
    return from(this.changeLanguage)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: response.value.updateSettings.language }
          : response
        )
      )
  }
}
