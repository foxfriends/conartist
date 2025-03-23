import { model } from "../model";
import { empty, extend, prepend, replaceById } from "../model/connection";
import { SuggestionsConnection } from "../api/suggestions-connection";
import { VoteForSuggestion } from "../api/vote-for-suggestion";

export function addSuggestion(suggestion) {
  model.next({
    ...model.getValue(),
    suggestions: prepend(model.getValue().suggestions, suggestion),
  });
}

export function loadSuggestions(fresh = false) {
  if (fresh) {
    model.next({
      ...model.getValue(),
      suggestions: empty(),
    });
  }
  const previous = fresh ? empty() : model.getValue().suggestions;
  new SuggestionsConnection()
    .send({ after: previous.endCursor })
    .subscribe(({ state, value, error }) => {
      switch (state) {
        case "retrieved":
          model.next({
            ...model.getValue(),
            suggestions: extend(previous, value),
          });
          break;
        case "failed":
          console.error(error);
          break;
      }
    });
}

export function voteForSuggestion(suggestionId) {
  new VoteForSuggestion()
    .send({ suggestionId })
    .subscribe(({ state, value, error }) => {
      switch (state) {
        case "retrieved":
          model.next({
            ...model.getValue(),
            suggestions: replaceById(model.getValue().suggestions, value),
          });
          break;
        case "failed":
          console.error(error);
          break;
      }
    });
}
