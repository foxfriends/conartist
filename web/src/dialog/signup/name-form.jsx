/* @flow */
import * as React from 'react'

import LOGO from '../../../icons/apple-icon-180x180.png'
import { l } from '../../localization'
import { Input } from '../../common/input'
import { Icon } from '../../common/icon'
import { Tooltip } from '../../common/tooltip'
import { Form } from './form'
import type { Props as FormProps } from './form'
import type { Validation as InputValidation } from '../../common/input'
import type { FormDelegate as Props } from './index'
import S from './form.css'

function validator(name: string): InputValidation {
  if (name.length === 0) {
    return { state: 'empty' }
  }
  return { state: 'valid' }
}

export function NameForm({ onValidate, onChange }: Props) {
  function handleChange(value: string) {
    const trimmed = value.replace(/(^\s+|\s+$)/g, "")
    onChange(trimmed)
    onValidate(validator(trimmed).state === 'valid')
  }
  return (
    <Form image={LOGO}>
      <div className={S.question}>
        { l`What do people call you?` }
        <Tooltip title={l``}>
          <Icon className={S.info} name="info_outline" />
        </Tooltip>
      </div>
      <Input className={S.input} placeholder={l`Your name`} onChange={handleChange} validator={validator} />
      <span className={S.hint}>{ l`You can change this later` }</span>
    </Form>
  )
}
