/* @flow */
import * as React from 'react'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { Table } from '../../common/table'
import { Button } from '../../common/button'
import { Row } from './row'
import { l } from '../../localization'
import * as update from '../../update/settings'
import S from './settings.css'

export type Props = {
  email: string,
  name: string,
}

export function AccountSettings({ email, name }: Props) {
  return (
    <Card>
      <BasicHeader>
        {l`Account`}
        <Button className={S.signOutButton} priority='secondary' title='Sign out' action={() => update.signOut()}>{l`Sign out`}</Button>
      </BasicHeader>
      <Table>
        <Row title={l`Email`} value={email} onEdit={update.changeEmail} />
        <Row title={l`Name`} value={name} onEdit={update.changeName} />
        <Row title={l`Password`} onEdit={update.changePassword} />
      </Table>
    </Card>
  )
}
