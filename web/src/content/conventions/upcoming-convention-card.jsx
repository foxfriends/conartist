/* @flow */
import * as React from 'react'
import moment from 'moment'

import { Table } from '../../common/table'
import { Row } from '../../common/table/row'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { IconButton } from '../../common/icon-button'
import { Link } from '../../common/link'
import { model } from '../../model'
import { l } from '../../localization'
import { newlinesToReact } from '../../util/newlines-to-react'
import type { Convention } from '../../model/convention'

import S from './card.css'
const { Fragment } = React

export type Props = {
  convention: Convention,
}

function format(date: Date): string {
  return moment(date).format(l`MMM. d, yyyy`)
}

function sc(content: React.Node) {
  return <span className={S.rowTitle}>{ content }</span>
}

export function UpcomingConventionCard({ convention }: Props) {
  const selected = model.getValue().conventions.some(({ id }) => id === convention.id)
  const { info: addressJson, action: coordsURL } = convention.extraInfo.find(({ title }) => title === 'Address')
  let address = null
  try {
    address = newlinesToReact(JSON.parse(addressJson))
  } catch(_) {}
  const { actionText: website, action: websiteURL } = convention.extraInfo.find(({ title }) => title === 'Website')

  return (
    <Card>
      <BasicHeader title={<><IconButton title={selected ? 'star' : 'star_outline'} action={() => {}} priority='secondary' className={`${S.star} ${selected ? S.starSelected : ''}`}/>{convention.name}</>} />
      <Table>
        <Row title={sc(l`Dates`)} value={l`${format(convention.start)} - ${format(convention.end)}`} />
        { address ? <Row tall title={sc(l`Address`)} value={address} /> : null}
        { website ? <Row title={sc(l`Website`)} value={<Link href={websiteURL}>{website}</Link>} /> : null }
      </Table>
    </Card>
  )
}
