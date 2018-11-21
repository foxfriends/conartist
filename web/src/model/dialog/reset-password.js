/* @flow */

export type ResetPassword = { name: 'reset-password', email: string }

export const resetPassword = (email: string = ''): ResetPassword => ({ name: 'reset-password', email })
