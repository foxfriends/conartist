/* @flow */
import * as React from 'react'
import { Basic } from '../basic'
import { Grid } from '../../common/grid'
import { Font } from '../../common/font'
import { model } from '../../model'
import { closeDialog } from '../action'
import { l } from '../../localization'
import S from './index.css'

export type Props = {
  name: 'export',
  type: 'products',
}

type ProductData = {
  id: number,
  name: string,
  quantity: number,
  type: string,
}

type Column = $Keys<ProductData>

type State = {
  columns: Column[],
  separateTypes: boolean,
}

function columnTitle(column: Column): string {
  switch (column) {
    case 'id':        return l`ID`
    case 'name':      return l`Product`
    case 'quantity':  return l`Quantity`
    case 'type':      return l`Type`
  }
  return ''
}

function data(columns: Column[]): (ProductData) => React.Node {
  return product => columns.map(column =>
    <span className={S.cell} key={`column_${column}_${product.id}`}>
      { product[column] }
    </span>
  )
}

export class ExportProducts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      columns: ['id', 'type', 'name', 'quantity'],
      separateTypes: true,
    }
  }

  doExport() {
    // TODO
  }

  render() {
    const { products, productTypes } = model.getValue()
    const { columns } = this.state

    const dataSource: ProductData[] = products
      // $FlowIgnore: should never not exist...
      .map(({ typeId, ...product }) => ({ ...product, type: productTypes.find(({ id }) => id === typeId).name }))

    const doExport = {
      title: l`Export`,
      action: () => this.doExport(),
    }

    return (
      <Basic title={l`Export Products`} onContinue={doExport} onClose={closeDialog}>
        <Grid columns={columns.length} className={S.grid}>
          { columns.map(column => <Font smallCaps semibold className={S.title} key={`column_title_${column}`}>{ columnTitle(column) }</Font>) }
          { dataSource.map(data(columns)) }
        </Grid>
      </Basic>
    )
  }
}
