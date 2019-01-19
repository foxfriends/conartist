/* @flow */
import * as React from 'react'
import { CardView } from '../card-view'
import { LocaleSettings } from './locale-settings'
import { AccountSettings } from './account-settings'
import { Help } from './help'
import { Contribute } from './contribute'
import type { Settings as SettingsT } from '../../model/settings'

export type Props = {
  name: 'settings',
  email: string,
  username: string,
  verified: boolean,
  settings: SettingsT,
}

export function Settings({ username, email, verified, settings }: Props) {
  return (
    <CardView>
      <AccountSettings name={username} email={email} verified={verified} />
      <LocaleSettings currency={settings.currency} language={settings.language} />
      <Contribute />
      <Help />
    </CardView>
  )
}
