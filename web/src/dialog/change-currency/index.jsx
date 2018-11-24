/* @flow */
import * as React from 'react'

import { l, localize } from '../../localization'
import { Basic } from '../basic'
import { Icon } from '../../common/icon'
import { AutoList as List } from '../../common/list/auto'
import { Item } from '../../common/list/item'
import { ChangeCurrency as ChangeCurrencyMutation } from '../../api/change-currency'
import { closeDialog as closeDialogButton } from '../action'
import { closeDialog } from '../../update/dialog'
import { CURRENCIES } from '../../constants'
import * as update from '../../update/settings'
import * as toast from '../../toast'
import S from './index.css'

export type Props = {
  name: 'change-currency',
}

export class ChangeCurrency extends React.Component<Props, State> {
  async setCurrency(currency) {
    const response = await new ChangeCurrencyMutation().send({ currency }).toPromise()
    update.setCurrency(currency)
    toast.show(<span>{l`Currency changed successfully`} <Icon name='check'/></span>)
    closeDialog()
  }

  render() {
    return (
      <Basic title={l`Change Currency`} onClose={closeDialogButton}>
        <List dataSource={CURRENCIES}>
          {currency =>
            <Item className={S.item} onClick={() => this.setCurrency(currency)} key={currency}>{currency}</Item>
          }
        </List>
      </Basic>
    )
  }
}
