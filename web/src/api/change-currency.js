/* @flow */
import type { Observable } from 'rxjs/Observable'
import { from } from 'rxjs';
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/user'
import type { Response, APIRequest, APIError } from './index'
import type {
  ChangeCurrency as ChangeCurrencyMutation,
  ChangeCurrencyVariables,
} from './schema'

export class ChangeCurrency implements APIRequest<ChangeCurrencyVariables, String> {
  changeCurrency: GraphQLMutation<ChangeCurrencyVariables, ChangeCurrencyMutation>

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const changeCurrency = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/update-currency.graphql')
    this.changeCurrency = changeCurrency.then(changeCurrency => new GraphQLMutation(changeCurrency.default))
  }

  send(variables: ChangeCurrencyVariables): Observable<Response<User, string>> {
    return from(this.changeCurrency)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: response.value.updateSettings.currency }
          : response
        )
      )
  }
}
