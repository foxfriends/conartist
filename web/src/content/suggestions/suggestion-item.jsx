/* @flow */
import * as React from 'react'
import { Item } from '../../common/list/item'
import { Vote } from '../../common/vote'
import { l } from '../../localization'
import type { Suggestion } from '../../model/suggestion'
import S from './suggestion-item.css'

export type Props = {
  suggestion: Suggestion,
}

export function SuggestionItem({ suggestion: { id, suggestion, ranking, voted } }: Props) {
  return (
    <Item className={S.item}>
      <span className={S.truncation}>{suggestion}</span>
      <Vote className={S.vote} vote={voted ? 1 : 0} upvotes={ranking} downvotes={null} onChange={() => {}} />
    </Item>
  )
}
