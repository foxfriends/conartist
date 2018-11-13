/* @flow */
import * as React from 'react'
import { CardView } from '../card-view'
import { BasicCard } from '../card-view/basic-card'
import { AutoList as List } from '../../common/list/auto'
import { SuggestionItem } from './suggestion-item'
import { l } from '../../localization'
import S from './index.css'
import type { Suggestion } from '../../model/suggestion'
const { Fragment } = React

export type Props = {
  name: 'suggestions',
  suggestions: Suggestion[],
}

export function Suggestions({ suggestions }: Props) {
  return (
    <CardView>
      <BasicCard title={l`Suggestions`}>
        <List dataSource={suggestions}>
          <Fragment>
            <div className={S.placeholder}>
              {l`There are no suggestions yet. Feel free to make a request!`}
              {/* TODO: get some images for this */}
            </div>
          </Fragment>
          {suggestion => <SuggestionItem suggestion={suggestion} key={suggestion.id} />}
        </List>
      </BasicCard>
    </CardView>
  )
}
