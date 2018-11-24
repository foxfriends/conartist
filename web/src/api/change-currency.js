/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/user'
import type { Response, APIRequest, APIError } from './index'
import type {
  ChangeCurrency as ChangeCurrencyMutation,
  ChangeCurrencyVariables,
} from './schema'

// $FlowIgnore: trouble importing graphql files
import changeCurrency from './graphql/mutation/update-currency.graphql'

export class ChangeCurrency implements APIRequest<ChangeCurrencyVariables, String> {
  changeCurrency: GraphQLMutation<ChangeCurrencyVariables, ChangeCurrencyMutation>

  constructor() {
    this.changeCurrency = new GraphQLMutation(changeCurrency)
  }

  send(variables: ChangeCurrencyVariables): Observable<Response<User, string>> {
    return this.changeCurrency.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: response.value.updateSettings.currency }
          : response
        )
      )
  }
}
