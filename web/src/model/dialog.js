/* @flow */
export type Dialog = SignUp | LogIn

export type SignUp = { name: 'SignUp', step: 'Email' | 'Name' | 'Password' | 'Terms' }
export type LogIn = { name: 'LogIn' }
