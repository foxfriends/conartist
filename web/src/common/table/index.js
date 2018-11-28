/* @flow */
import * as React from 'react'
import { Grid } from '../grid'

export type Props = {
  children: React.Node,
}

export function Table({ children }: Props) {
  return <Grid columns='2fr 2fr 1fr'>{ children }</Grid>
}
