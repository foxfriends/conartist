/* @flow */
import * as React from 'react'
import { CardView } from '../card-view'
import { LocaleSettings } from './locale-settings'
import { AccountSettings } from './account-settings'
import type { Settings as SettingsT } from '../../model/settings'

export type Props = {
  name: 'settings',
  email: string,
  username: string,
  settings: SettingsT,
}

export function Settings({ username, email, settings }: Props) {
  return (
    <CardView>
      <AccountSettings name={username} email={email} />
      <LocaleSettings currency={settings.currency} language={settings.language} />
    </CardView>
  )
}
