/* @flow */
import * as React from 'react'
import l from '../localization'
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
  title: l`Log in`,
  action() {}
}

export const SignUp: Definition = {
  title: l`Sign up`,
  action() {}
}

export function Action({ title, action, priority }: Props & Definition) {
  const isPrimary = priority === 'primary'
  return (
    <button onClick={action} className={isPrimary ? S.primary : S.secondary}>
      {title}
    </button>
  )
}
