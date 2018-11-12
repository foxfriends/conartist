/* @flow */
import type { SuggestionFragment } from '../api/schema'

export type Suggestion = {|
  name: 'suggestion',
  id: number,
  suggestion: string,
  suggester: string,
  status: number,
  rating: number,
  voted: boolean,
  time: Date,
|}

export function parse({ id, suggester: { name }, suggestion, suggestedAt: time, status, voted, rating }: SuggestionFragment): Record {
  return {
    name: 'suggestion',
    id,
    suggestion,
    suggester: name,
    status,
    rating,
    voted,
    time,
  }
}
