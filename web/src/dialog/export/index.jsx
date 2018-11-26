/* @flow */
import * as React from 'react'
import { ExportProducts } from './products'
import { ExportRecords } from './records'
import type { Props as ProductsProps } from './products'
import type { Props as RecordsProps } from './records'

export type Props = ProductsProps | RecordsProps

export function Export(props: Props) {
  switch (props.type) {
    case 'products':
      return <ExportProducts {...props} />
    case 'records':
      return <ExportRecords {...props} />
  }
  return null
}

export default Export
