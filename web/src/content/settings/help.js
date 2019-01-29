/* @flow */
import * as React from 'react'
import { BasicCard } from '../card-view/basic-card'
import { Table } from '../../common/table'
import { Row } from '../../common/table/row'
import { Link } from '../../common/link'
import { l, lx } from '../../localization'
import DISCORD from '../../../images/discord.svg'
import { SUPPORT_EMAIL, CON_REQUEST_URL, DISCORD_URL } from '../../constants'
import * as navigate from '../../update/navigate'
import S from './settings.css'

export type Props = {}

export function Help() {
  return (
    <BasicCard title={l`Support`}>
      <Table>
        <Row truncate title={l`Privacy Policy`} detail={<Link onClick={navigate.privacy} className={S.caps}>{l`View`}</Link>} />
        <Row truncate title={l`Terms of Service`} detail={<Link onClick={navigate.terms} className={S.caps}>{l`View`}</Link>} />
        <Row truncate title={l`FAQ`} detail={<Link onClick={navigate.faq} className={S.caps}>{l`View`}</Link>} />
        <Row truncate title={l`Request a Convention`} detail={<Link target='_blank' href={CON_REQUEST_URL} className={S.caps}>{l`Details`}</Link>} />
        <Row truncate title={l`Contact Support`} detail={<Link href={`mailto:${SUPPORT_EMAIL}`} className={S.caps}>{SUPPORT_EMAIL}</Link>} />
        <Row truncate title={l`Chat on Discord`} detail={<Link href={DISCORD_URL} className={S.caps}>{<img src={DISCORD} height={30} alt={l`Chat on Discord`} />}</Link>} />
      </Table>
      <p className={S.description}>{lx`<Support description>`(_ => _)}</p>
    </BasicCard>
  )
}
