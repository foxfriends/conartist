/* @flow */
import type { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
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
    const request = vote === 1 ? this.upvote : this.downvote
    return request.send({ infoId: id })
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value) }
          : response
        )
      )
  }
}
