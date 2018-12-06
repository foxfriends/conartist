/* @flow */
import * as React from 'react'
import { BasicCard } from '../card-view/basic-card'
import { Table } from '../../common/table'
import { Row } from '../../common/table/row'
import { Link } from '../../common/link'
import { l } from '../../localization'
import * as navigate from '../../update/navigate'
import S from './row.css'

export type Props = {}

export function Help() {
  return (
    <BasicCard title={l`Help`}>
      <Table>
        <Row title={l`Report a bug/Request a feature`} detail={<Link onClick={navigate.suggestions} className={S.caps}>{l`View`}</Link>} />
        <Row title={l`Privacy Policy`} detail={<Link onClick={navigate.privacy} className={S.caps}>{l`View`}</Link>} />
        <Row title={l`Terms of Service`} detail={<Link onClick={navigate.terms} className={S.caps}>{l`View`}</Link>} />
      </Table>
    </BasicCard>
  )
}
