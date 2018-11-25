/* @flow */
import type { Observable } from 'rxjs'
import { of, from } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import type { ConventionUserInfo } from '../model/convention-user-info'
import type { Response, APIRequest, APIError } from './index'
import type {
  DownvoteConventionInfo as DownvoteConventionInfoMutation,
  DownvoteConventionInfoVariables,
  UpvoteConventionInfo as UpvoteConventionInfoMutation,
  UpvoteConventionInfoVariables,
} from './schema'

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
    // $FlowIgnore: trouble importing graphql files
    const downvoteConventionInfo = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/downvote-convention-info.graphql')
    // $FlowIgnore: trouble importing graphql files
    const upvoteConventionInfo = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/upvote-convention-info.graphql')
    this.downvote = downvoteConventionInfo.then(downvoteConventionInfo => new GraphQLMutation(downvoteConventionInfo.default))
    this.upvote = upvoteConventionInfo.then(upvoteConventionInfo => new GraphQLMutation(upvoteConventionInfo.default))
  }

  send({ id, vote }: Params): Observable<Response<Votes, string>> {
    if (vote === 1) {
      return from(this.upvote)
        .pipe(
          flatMap(req => req.send({ infoId: id })),
          map(response => response.state === 'retrieved'
            ? { state: 'retrieved', value: parse(response.value.upvoteConventionInfo) }
            : response
          )
        )
    } else if(vote === -1) {
      return from(this.downvote)
        .pipe(
          flatMap(req => req.send({ infoId: id })),
          map(response => response.state === 'retrieved'
            ? { state: 'retrieved', value: parse(response.value.downvoteConventionInfo) }
            : response
          )
        )
    }
    return of({ state: 'failed', error: 'Can only up or downvote, not "no" vote' })
  }
}
