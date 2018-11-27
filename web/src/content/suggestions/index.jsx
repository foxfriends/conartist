/* @flow */
import * as React from 'react'
import { CardView } from '../card-view'
import { BasicCard } from '../card-view/basic-card'
import { AutoTable as Table } from '../../common/table/auto'
import { SuggestionItem } from './suggestion-item'
import { l } from '../../localization'
import * as update from '../../update/suggestions'
import S from './index.css'
import type { Suggestion } from '../../model/suggestion'
const { Fragment } = React

export type Props = {
  name: 'suggestions',
  suggestions: Connection<Suggestion>,
}

type State = {
  page: number,
}

export class Suggestions extends React.Component {
  constructor(props) {
    super(props)
    this.state = { page: 0 }
  }

  componentDidMount() {
    update.loadSuggestions();
  }

  render() {
    const { suggestions } = this.props
    return (
      <CardView>
        <BasicCard title={l`Suggestions`}>
          <Table dataSource={suggestions.nodes}>
            <Fragment>
              <div className={S.placeholder}>
                {l`There are no suggestions yet. Feel free to make a request!`}
              </div>
            </Fragment>
            {suggestion => <SuggestionItem suggestion={suggestion} key={suggestion.id} />}
          </Table>
        </BasicCard>
      </CardView>
    )
  }
}
