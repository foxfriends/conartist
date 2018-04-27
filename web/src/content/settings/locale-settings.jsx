/* @flow */
import * as React from 'react'
import { BasicCard } from '../card-view/basic-card'
import { Table } from '../../common/table'
import { Row } from './row'
import { l } from '../../localization'
import type { Currency } from '../../model/money'

export type Props = {
  currency: Currency,
  language: string,
}

export function LocaleSettings({ currency, language }: Props) {
  return (
    <BasicCard title={l`Language & Location`}>
      <Table>
        <Row title={l`Currency`} value={currency} onEdit={() => {}} />
        <Row title={l`Language`} value={language} onEdit={() => {}} />
      </Table>
    </BasicCard>
  )
}
