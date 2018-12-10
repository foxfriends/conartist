/* @flow */
import * as React from 'react'
import { BasicCard } from '../card-view/basic-card'
import { Table } from '../../common/table'
import { Row } from '../../common/table/row'
import { Link } from '../../common/link'
import { l, lx } from '../../localization'
import { SUPPORT_EMAIL } from '../../constants'
import * as navigate from '../../update/navigate'
import S from './settings.css'

export type Props = {}

export function Help() {
  return (
    <BasicCard title={l`Help`}>
      <Table>
        <Row title={l`Privacy Policy`} detail={<Link onClick={navigate.privacy} className={S.caps}>{l`View`}</Link>} />
        <Row title={l`Terms of Service`} detail={<Link onClick={navigate.terms} className={S.caps}>{l`View`}</Link>} />
        <Row title={l`Contact Support`} detail={<Link href={`mailto:${SUPPORT_EMAIL}`} className={S.caps}>{SUPPORT_EMAIL}</Link>} />
      </Table>
      <p className={S.description}>{lx`<Support description>`(_ => _)}</p>
    </BasicCard>
  )
}
