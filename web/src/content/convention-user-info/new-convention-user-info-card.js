/* @flow */
import * as React from 'react'

import { Font } from '../../common/font'
import { IconButton } from '../../common/icon-button'
import { Textarea } from '../../common/textarea'
import { Cover } from '../../common/cover'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { l, lx } from '../../localization'
import * as update from '../../update/user-info'
import type { Convention } from '../../model/convention'
import S from './card.css'

const { Fragment } = React

export type Props = {
  convention: Convention,
}

export type State = {
  info: string,
  editingEnabled: boolean,
  textareaKey: string,
}

export class NewConventionUserInfoCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      info: '',
      editingEnabled: true,
      textareaKey: Math.random().toString(),
    }
  }

  async saveInfo() {
    const { info } = this.state
    const { convention } = this.props
    if (info !== '') {
      this.setState({ editingEnabled: false })
      await update.addUserInfo(convention, info)
      this.setState({ info: '', editingEnabled: true, textareaKey: Math.random().toString() })
    }
  }

  render() {
    const { editingEnabled, textareaKey } = this.state

    return (
      <Fragment>
        <Card className={S.shareInfoCard}>
          <BasicHeader>
            <Font smallCaps>{l`Share Info`}</Font>
            <IconButton className={S.sendButton} title='send' action={() => { this.saveInfo() }} />
          </BasicHeader>
          <div className={S.form}>
            {/* $FlowIgnore */}
            <Textarea key={textareaKey} className={S.full} placeholder={l`Keep it short and sweet!`} onChange={info => this.setState({ info })} />
            { editingEnabled ? null : <Cover /> }
          </div>
        </Card>
        <Card className={S.disclaimerCard}>
          <div className={S.disclaimer}>
            {lx`<Convention info contribution disclaimer>`(_ => _)}
          </div>
        </Card>
      </Fragment>
    )
  }
}
