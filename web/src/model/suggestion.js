/* @flow */
import type { SuggestionFragment } from '../api/schema'

export type Suggestion = {|
  name: 'suggestion',
  id: number,
  suggestion: string,
  suggester: string,
  status: number,
  ranking: number,
  voted: boolean,
  time: Date,
|}

export function parse({ id, suggester: { name }, suggestion, suggestedAt: time, status, voted, ranking }: SuggestionFragment): Record {
  return {
    name: 'suggestion',
    id,
    suggestion,
    suggester: name,
    status,
    ranking,
    voted,
    time,
  }
}
