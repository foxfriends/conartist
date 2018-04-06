/* @flow */
import type { SignUp } from './signup'
import type { SignIn } from './signin'

export type Dialog = SignUp | SignIn

export type Name = $PropertyType<Dialog, 'name'>
