/* @flow */
import type { Observable } from 'rxjs'
import { of } from 'rxjs'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import type { ConventionUserInfo } from '../model/convention-user-info'
import type { Response, APIRequest, APIError } from './index'
import type {
  DownvoteConventionInfoMutation,
  DownvoteConventionInfoMutationVariables,
  UpvoteConventionInfoMutation,
  UpvoteConventionInfoMutationVariables,
} from './schema'

// $FlowIgnore: trouble importing graphql files
import downvoteConventionInfo from './graphql/mutation/downvote-convention-info.graphql'
// $FlowIgnore: trouble importing graphql files
import upvoteConventionInfo from './graphql/mutation/upvote-convention-info.graphql'

export type Params = {
  id: number,
  vote: number,
}
export type Votes = {
  id: number,
  upvotes: number,
  downvotes: number,
}

function parse(info: UpvoteConventionInfoMutation | DownvoteConventionInfoMutation) {
  const data = info.upvoteConventionInfo || info.downvoteConventionInfo
  return {
    upvotes: data.upvotes,
    downvotes: data.downvotes,
    vote: info.upvoteConventionInfo ? 1 : -1,
  }
}

export class VoteForInfo implements APIRequest<Params, Votes> {
  downvote: GraphQLMutation<DownvoteConventionInfoMutationVariables, DownvoteConventionInfoMutation>
  upvote: GraphQLMutation<UpvoteConventionInfoMutationVariables, UpvoteConventionInfoMutation>

  constructor() {
    this.downvote = new GraphQLMutation(downvoteConventionInfo)
    this.upvote = new GraphQLMutation(upvoteConventionInfo)
  }

  send({ id, vote }: Params): Observable<Response<Votes, string>> {
    if (vote === 1) {
      return this.upvote.send({ infoId: id })
        .pipe(
          map(response => response.state === 'retrieved'
            ? { state: 'retrieved', value: parse(response.value.upvoteConventionInfo) }
            : response
          )
        )
    } else if(vote === -1) {
      return this.downvote.send({ infoId: id })
        .pipe(
          map(response => response.state === 'retrieved'
            ? { state: 'retrieved', value: parse(response.value.downvoteConventionInfo) }
            : response
          )
        )
    }
    return of({ state: 'failed', value: 'Can only up or downvote, not "no" vote' })
  }
}
