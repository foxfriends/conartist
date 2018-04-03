/* @flow */
export type Dialog = SignUp | LogIn

export type SignUp = { name: 'signup', step: 'Email' | 'Name' | 'Password' | 'Terms' }
export type LogIn = { name: 'login' }
