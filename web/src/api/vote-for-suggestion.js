/* @flow */
import type { Observable } from 'rxjs'
import { from } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/suggestion'
import type { Suggestion } from '../model/suggestion'
import type { Response, APIRequest, APIError } from './index'
import type {
  VoteForSuggestion as VoteForSuggestionMutation,
  VoteForSuggestionVariables,
} from './schema'

export class VoteForSuggestion implements APIRequest<VoteForSuggestionVariables, Suggestion> {
  vote: GraphQLMutation<VoteForSuggestionVariables, VoteForSuggestionMutation>

  constructor() {
    const vote = import(/* webpackChunkName: 'suggestions' */ './graphql/mutation/vote-for-suggestion.graphql')
    this.vote = vote.then(vote => new GraphQLMutation(vote.default))
  }

  send(params: VoteForSuggestionVariables): Observable<Response<Suggestion, string>> {
    return from(this.vote)
      .pipe(
        flatMap(req => req.send(params)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.voteForSuggestion) }
          : response
        )
      )
  }
}
