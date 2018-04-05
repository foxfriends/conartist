/* @flow */
import * as React from 'react'

type Props = {
  name: string,
}

export function Icon({ name }: Props) {
  return <span className="material-icons">{name}</span>
}
