import { model } from '../model'
import { empty, extend, prepend } from '../model/connection'
import { SuggestionsConnection } from '../api/suggestions-connection'

export function addSuggestion(suggestion) {
  model.next({
    ...model.getValue(),
    suggestions: prepend(model.getValue().suggestions, suggestion)
  })
}

export function loadSuggestions(fresh: boolean = false) {
  if (fresh) {
    model.next({
      ...model.getValue(),
      suggestions: empty(),
    })
  }
  const previous = fresh ? empty() : model.getValue().suggestions
  new SuggestionsConnection()
    .send({ after: previous.endCursor })
    .subscribe(({ state, value, error }) => {
      if (state === 'retrieved') {
        model.next({
          ...model.getValue(),
          suggestions: extend(previous, value),
        })
      } else if (state === 'failed') {
        console.error(error)
      }
    })
}
