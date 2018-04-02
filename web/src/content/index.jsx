/* @flow */
import * as React from 'react'
import { Card } from './card'
import type { Props as CardProps } from './card';

export type Props = { cards: CardProps[] }

export function Content({ cards }: Props) {
  return cards.map(card => <Card { ...card }/>)
}
