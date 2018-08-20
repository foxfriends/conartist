/* @flow */
import type { Observable } from 'rxjs'
import { of } from 'rxjs'
import { map } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import type { ConventionUserInfo } from '../model/convention-user-info'
import type { Response, APIRequest, APIError } from './index'
import type {
  DownvoteConventionInfo as DownvoteConventionInfoMutation,
  DownvoteConventionInfoVariables,
  UpvoteConventionInfo as UpvoteConventionInfoMutation,
  UpvoteConventionInfoVariables,
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

// $FlowIgnore: doing some types magic here
function parse(info: UpvoteConventionInfoMutation | DownvoteConventionInfoMutation) {
  const data = info.upvoteConventionInfo || info.downvoteConventionInfo
  return {
    // $FlowIgnore: doing some types magic here
    upvotes: data.upvotes,
    // $FlowIgnore: doing some types magic here
    downvotes: data.downvotes,
    vote: info.upvoteConventionInfo ? 1 : -1,
  }
}

export class VoteForInfo implements APIRequest<Params, Votes> {
  downvote: GraphQLMutation<DownvoteConventionInfoVariables, DownvoteConventionInfoMutation>
  upvote: GraphQLMutation<UpvoteConventionInfoVariables, UpvoteConventionInfoMutation>

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
    return of({ state: 'failed', error: 'Can only up or downvote, not "no" vote' })
  }
}
