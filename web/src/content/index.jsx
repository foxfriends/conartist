/* @flow */
import * as React from 'react'
import { Card } from './card'
import type { Props as CardProps } from './card';
import S from './index.css'

export type Props = { cards: CardProps[] }

export function Content({ cards }: Props) {
  return (
    <main className={S.container}>
      { cards.map((card, key) => <Card { ...card } key={`content_card_${key}`}/>) }
    </main>
  )
}
