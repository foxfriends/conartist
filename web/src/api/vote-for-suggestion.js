/*       */

import { from } from "rxjs";
import { map, flatMap } from "rxjs/operators";

import { GraphQLMutation } from "./index";
import { parse } from "../model/suggestion";

export class VoteForSuggestion {
  vote;

  constructor() {
    const vote = import(
      /* webpackChunkName: 'suggestions' */ "./graphql/mutation/vote-for-suggestion.graphql"
    );
    this.vote = vote.then((vote) => new GraphQLMutation(vote.default));
  }

  send(params) {
    return from(this.vote).pipe(
      flatMap((req) => req.send(params)),
      map((response) =>
        response.state === "retrieved"
          ? {
              state: "retrieved",
              value: parse(response.value.voteForSuggestion),
            }
          : response,
      ),
    );
  }
}
