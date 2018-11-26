/* @flow */
import * as React from 'react'
import { ImportProducts } from './products'
import type { Props as ProductsProps } from './products'

export type Props = ProductsProps

export function Import(props: Props) {
  switch (props.type) {
    case 'products':
      return <ImportProducts {...props} />
  }
  return null
}

export default Import
