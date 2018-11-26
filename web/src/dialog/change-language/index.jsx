/* @flow */
import * as React from 'react'

import { l, localize } from '../../localization'
import { Basic } from '../basic'
import { Icon } from '../../common/icon'
import { AutoList as List } from '../../common/list/auto'
import { Item } from '../../common/list/item'
import { ChangeLanguage as ChangeLanguageMutation } from '../../api/change-language'
import { closeDialog as closeDialogButton } from '../action'
import { closeDialog } from '../../update/dialog'
import { LANGUAGES } from '../../constants'
import * as update from '../../update/settings'
import * as toast from '../../toast'
import S from './index.css'

export type Props = {
  name: 'change-language',
}

export class ChangeLanguage extends React.Component<Props, State> {
  async setLanguage(language) {
    const response = await new ChangeLanguageMutation().send({ language }).toPromise()
    update.setLanguage(language)
    toast.show(<span>{l`Language changed successfully`} <Icon name='check'/></span>)
    closeDialog()
  }

  render() {
    return (
      <Basic title={l`Change Language`} onClose={closeDialogButton}>
        <List dataSource={LANGUAGES}>
          {language =>
            <Item className={S.item} onClick={() => this.setLanguage(language)} key={language}>{localize(language)}</Item>
          }
        </List>
      </Basic>
    )
  }
}

export default ChangeLanguage
