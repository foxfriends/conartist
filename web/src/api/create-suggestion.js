/* @flow */
import type { Observable } from 'rxjs/Observable'
import { from } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/suggestion'
import type { Response, APIRequest } from './index'
import type {
  CreateSuggestion as CreateSuggestionMutation,
  CreateSuggestionVariables,
} from './schema'
import type { Suggestion } from '../model/suggestion'

export class CreateSuggestion implements APIRequest<CreateSuggestionVariables, null> {
  delUserConvention: GraphQLMutation<CreateSuggestionVariables, CreateSuggestionMutation>

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const createSuggestion = import(/* webpackChunkName: 'suggestions' */ './graphql/mutation/create-suggestion.graphql')
    this.createSuggestion = createSuggestion.then(createSuggestion => new GraphQLMutation(createSuggestion.default))
  }

  send(variables: CreateSuggestionVariables): Observable<Response<Suggestion, string>> {
    return from(this.createSuggestion)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.createSuggestion) }
          : response
        ),
      )
  }
}
