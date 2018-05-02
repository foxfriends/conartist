/* @flow */
import * as React from 'react'
import { ExportProducts } from './products'
import type { Props as ProductsProps } from './products'

export type Props = ProductsProps

export function Export(props: Props) {
  switch (props.type) {
    case 'products':
      return <ExportProducts {...props} />
  }
  return null
}
