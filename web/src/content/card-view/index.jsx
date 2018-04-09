/* @flow */
import * as React from 'react'
import { Card } from './card'
import type { Props as CardProps } from './card'

export type Props = { 
  name: 'card-view', 
  cards: CardProps[] 
}

export function CardView({ cards }: Props) {
  const { Fragment } = React
  return (
    <Fragment>
      { cards.map((card, key) => <Card { ...card } key={`content_card_${key}`}/>) }
    </Fragment>
  )
}
