/* @flow */
import * as React from 'react'

import { Font } from '../../common/font'
import { Table } from '../../common/table'
import { Link } from '../../common/link'
import { Icon } from '../../common/icon'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { l } from '../../localization'
import { Money } from '../../model/money'
import * as navigate from '../../update/navigate'
import type { Convention } from '../../model/convention'
import S from './card.css'

export type Props = {
  convention: Convention,
}

export function ConventionStatsCard({ convention }: Props) {
  // $FlowIgnore: not catching defaulting of missing props
  if ((convention.records || []).length === 0) { return null }
  return (
    <Card>
      <BasicHeader>
        <Font smallCaps>{l`Stats`}</Font>
        <Link className={S.detailsButton} priority='tertiary' onClick={() => navigate.conventionStats(convention)}><Font smallCaps>{l`See all`}</Font><Icon name='keyboard_arrow_right' /></Link>
      </BasicHeader>
      <div className={S.placeholder}>
        {l`This page is coming soon!`}
      </div>
      <Table>
      </Table>
    </Card>
  )
}
