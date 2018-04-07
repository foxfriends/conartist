/* @flow */
import * as React from 'react'

export type Validation = { state: 'valid' } | { state: 'empty' } | { state: 'error', message: string }

export type Props = {
  type?: 'text' | 'password' | 'email',
  title?: string,
  placeholder?: string,
  defaultValue?: string,
  onChange: (string) => void,
  validator?: (string) => Validation,
}

export function Input({ title, type, placeholder, defaultValue, onChange, validator }: Props) {
  return (
    <div>
      <input onChange={onChange} type={type || 'text'} />
    </div>
  )
}
