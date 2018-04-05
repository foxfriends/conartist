/* @flow */
import * as React from 'react'
import { localize } from '../localization'
import S from './action.css'

type Priority = 'primary' | 'secondary'

export type Definition = {
  title: string,
  action: () => void,
}

type Props = {
  priority: Priority,
}

export const LogIn: Definition = {
  title: 'Sign in',
  action() {}
}

export const SignUp: Definition = {
  title: 'Sign up',
  action() {}
}

export function Action({ title, action, priority }: Props & Definition) {
  const isPrimary = priority === 'primary'
  return (
    <button onClick={action} className={isPrimary ? S.primary : S.secondary}>
      {localize(title)}
    </button>
  )
}
