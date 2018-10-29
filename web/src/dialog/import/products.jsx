/* @flow */
import * as React from 'react'

import { Basic } from '../basic'
import { Grid } from '../../common/grid'
import { List } from '../../common/list'
import { Item } from '../../common/list/item'
import { Checkbox } from '../../common/checkbox'
import { Select } from '../../common/select'
import { Icon } from '../../common/icon'
import { Tooltip } from '../../common/tooltip'
import { model } from '../../model'
import { closeDialog } from '../action'
import { l } from '../../localization'
import { separate } from '../../util/iterable'
import S from '../export/index.css' // NOTE: using export dialog css because it's very similar!

export type Props = {
  name: 'import',
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
  includeIds: boolean,
  productType: ?ProductType,
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

export class ImportProducts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      includeIds: true,
      productType: null,
    }
  }

  get columns(): Column[] {
    const { includeIds, productType } = this.state
    // $FlowIgnore
    return [
      includeIds ? 'id' : null,
      productType ? null : 'type',
      'name',
      'quantity',
    ].filter(x => x)
  }

  get dataSource(): ProductData[] {
    // using the user's current data as demo?
    // TODO: make up some fake data for when there is none
    const { products, productTypes } = model.getValue()
    return products
      .filter(({ discontinued }) => !discontinued)
      .map(({ typeId, ...product }) => ({ ...product, type: productTypes.find(({ id }) => id === typeId) }))
      .filter(({ type }) => !type.discontinued)
      .map(({ type, ...product }) => ({ ...product, type: type.name }))
  }

  async doImport() {
    // TODO
  }

  render() {
    const { productType, includeIds } = this.state
    const { columns, dataSource } = this
    const { productTypes } = model.getValue()

    const doImport = {
      title: l`Import`,
      action: () => { this.doImport() },
    }

    const columnTitles = columns.map(column => <span className={S.columnTitle} key={`column_title_${column}`}>{ columnTitle(column) }</span>)

    return (
      <Basic title={l`Import Products`} footerTitle={l`Ensure the format above matches your data`} onContinue={doImport} onClose={closeDialog}>
        <div className={S.container}>
          <div className={S.options}>
            <span className={S.optionsTitle}>{l`Options`}</span>
            <div className={S.option}>
              <Checkbox defaultValue={includeIds} onChange={includeIds => this.setState({ includeIds })}>
                {l`Includes IDs`}
              </Checkbox>
              <Tooltip className={S.info} title={l`Include IDs to modify exisiting products. New products can be left with an empty ID.`}>
                <Icon className={S.tooltip} name='info_outline' />
              </Tooltip>
            </div>
            <div className={S.option}>
              <Select
                title={l`Product Type`}
                options={[null, ...productTypes]}
                defaultValue={productType}
                onChange={productType => this.setState({ productType })}
                className={S.select}
                >
                {type => type ? type.name : l`All`}
              </Select>
              <Tooltip className={S.info} title={productType ? l`Importing only ${productType.name}` : l`Product type is specified as a column`}>
                <Icon className={S.tooltip} name='info_outline' />
              </Tooltip>
            </div>
          </div>
          <div className={S.preview}>
            <Grid columns={columns.length} className={S.grid}>
              { (productType ? [['', dataSource.filter(({ type }) => type === productType.name)]] : [['', dataSource]])
                  .map(([name, items]) => [name, items.map(data(columns))])
                  .map(([name, items]) => [name, [columnTitles, ...items]])
                  .map(([name, items]) => [name ? <span className={S.fileName} style={{gridColumnEnd: `span ${columns.length}`}} key={`file_name_${name}`}>{name}</span> : null, items])
              }
            </Grid>
          </div>
        </div>
      </Basic>
    )
  }
}
