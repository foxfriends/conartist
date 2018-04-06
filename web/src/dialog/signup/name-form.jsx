/* @flow */
import * as React from 'react'

import type { Props } from './form'

export function NameForm({ onValidate, onChange }: Props) {
  function handleChange(event: SyntheticEvent<HTMLInputElement>) {
    const { currentTarget: { value } } = event
    const trimmed = value.replace(/(^\s+|\s+$)/g, "")
    onChange(trimmed)
    onValidate(trimmed != "")
  }
  return (
    <input type="text" onChange={handleChange} />
  )
}
