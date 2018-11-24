/* @flow */
import * as React from 'react'
import { BasicCard } from '../card-view/basic-card'
import { Table } from '../../common/table'
import { Row } from './row'
import { l, localize } from '../../localization'
import * as update from '../../update/settings'
import type { Currency } from '../../model/money'

export type Props = {
  currency: Currency,
  language: string,
}

export function LocaleSettings({ currency, language }: Props) {
  return (
    <BasicCard title={l`Language & Location`}>
      <Table>
        <Row title={l`Currency`} value={currency} onEdit={update.changeCurrency} />
        <Row title={l`Language`} value={localize(language)} onEdit={update.changeLanguage} />
      </Table>
    </BasicCard>
  )
}
