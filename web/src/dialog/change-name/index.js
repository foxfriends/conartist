/* @flow */
import * as React from 'react'

import { l } from '../../localization'
import { Input } from '../../common/input'
import { Button } from '../../common/button'
import { Icon } from '../../common/icon'
import { Basic } from '../basic'
import { ChangeName as ChangeNameMutation } from '../../api/change-name'
import { closeDialog as closeDialogButton } from '../action'
import { closeDialog } from '../../update/dialog'
import * as update from '../../update/settings'
import * as toast from '../../toast'
import { VALID, EMPTY, INVALID } from '../../model/validation'
import type { Validation as InputValidation } from '../../common/input'
import S from './index.css'

export type Props = {
  name: 'change-name',
}

type State = {
  name: string,
  processing: boolean,
}

export class ChangeName extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      name: '',
      processing: false,
    }
  }

  async saveChanges() {
    const { name } = this.state
    this.setState({ processing: true })
    const response = await new ChangeNameMutation().send({ name }).toPromise()
    this.setState({ processing: false })
    update.setName(name)
    toast.show(<span>{l`Name changed successfully`} <Icon name='check'/></span>)
    closeDialog()
  }

  render() {
    const { name, processing } = this.state
    const save = {
      enabled: !!name.trim() && !processing,
      title: 'Save',
      action: () => this.saveChanges(),
    }
    return (
      <Basic title={l`Change Name`} onClose={closeDialogButton} onContinue={save}>
        <div className={S.form}>
          <Input
            className={S.input}
            title={l`New name`}
            onChange={name => this.setState({ name })}
            onSubmit={() => this.saveChanges()}
            />
        </div>
      </Basic>
    )
  }
}

export default ChangeName
