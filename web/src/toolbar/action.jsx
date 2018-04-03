/* @flow */
import * as React from 'react'
import l from '../localization'

export type Props = {
  title: string,
  action: () => void,
}

export const LogIn: Props = {
  title: l`Log in`,
  action() {}
}

export const SignUp: Props = {
  title: l`Sign up`,
  action() {}
}

export function Action({ title, action }: Props) {
  return (
    <button onClick={action}>
      {title}
    </button>
  )
}
