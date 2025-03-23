/*       */
import * as React from 'react'

import IMAGE from '../../../images/name.png'
import { l, lx } from '../../localization'
import { Input } from '../../common/input'
import { Icon } from '../../common/icon'
import { Tooltip } from '../../common/tooltip'
import { Form } from '../form'
                                                 
                                                                       
                                                    
import S from '../form.css'

function validator(name        )                  {
  if (name.length === 0) {
    return { state: 'empty' }
  }
  return { state: 'valid' }
}

export function NameForm({ onValidate, onChange, onSubmit }       ) {
  function handleChange(value        ) {
    const trimmed = value.replace(/(^\s+|\s+$)/g, "")
    onChange(trimmed)
    onValidate(validator(trimmed).state === 'valid')
  }
  return (
    <Form image={IMAGE} imageWidth={200}>
      <div className={S.question}>
        { l`What do people call you?` }
        <Tooltip title={lx`<Name usage disclaimer>`(_ => _)}>
          <Icon className={S.info} name="info_outline" />
        </Tooltip>
      </div>
      <Input className={S.input} placeholder={l`Your name`} onChange={handleChange} validator={validator} onSubmit={onSubmit} key="name" autoFocus />
      <span className={S.hint}>{ l`You can change this later` }</span>
    </Form>
  )
}
