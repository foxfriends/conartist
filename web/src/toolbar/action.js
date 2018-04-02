/* @flow */
import l from '../localization'

export type Action = {|
  title: string,
  action: () => void,
|}

export const LogIn: Action = {
  title: l`Log in`,
  action() {}
}

export const SignUp: Action = {
  title: l`Sign up`,
  action() {}
}
