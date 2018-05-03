/* @flow */
import * as React from 'react'
import saveAs from 'save-as'
import Zip from 'jszip'

import { Basic } from '../basic'
import { Grid } from '../../common/grid'
import { List } from '../../common/list'
import { Item } from '../../common/list/item'
import { Checkbox } from '../../common/checkbox'
import { Icon } from '../../common/icon'
import { Tooltip } from '../../common/tooltip'
import { model } from '../../model'
import { closeDialog } from '../action'
import { l } from '../../localization'
import { separate } from '../../util/iterable'
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
  includeIds: boolean,
  separateTypes: boolean,
  includeTitles: boolean,
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
      includeIds: true,
      separateTypes: true,
      includeTitles: true,
    }
  }

  get columns(): Column[] {
    const { includeIds, separateTypes } = this.state
    // $FlowIgnore
    return [
      includeIds ? 'id' : null,
      separateTypes ? null : 'type',
      'name',
      'quantity',
    ].filter(x => x)
  }

  get dataSource(): ProductData[] {
    const { products, productTypes } = model.getValue()
    return products
      .filter(({ discontinued }) => !discontinued)
      .map(({ typeId, ...product }) => ({ ...product, type: productTypes.find(({ id }) => id === typeId) }))
      .filter(({ type }) => !type.discontinued)
      .map(({ type, ...product }) => ({ ...product, type: type.name }))
  }

  async doExport() {
    const { columns, dataSource } = this
    const { separateTypes, includeTitles } = this.state
    const files: [string, Blob][] = ((separateTypes ? [...separate.call(dataSource, 'type')] : [['products', dataSource]]))
      .map(([name, file]) => [name, file.map(item => columns.map(column => item[column].toString()))])
      .map(([name, file]) => [name, file.map(item => item.join(','))])
      .map(([name, file]) => [name, includeTitles ? [columns.map(columnTitle).join(','), ...file] : file])
      .map(([name, file]) => [name, file.join('\n') + '\n'])
      .map(([name, file]) => [name, new Blob([file], { type: 'text/plain;charset=utf-8' })])
    if (separateTypes) {
      const zip = new Zip()
      for (const [name, blob] of files) {
        zip.file(`${name}.csv`, blob)
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, `${l`Products`.toLowerCase()}.zip`)
    } else {
      const [[name, blob]] = files
      saveAs(blob, `${name}.csv`)
    }
  }

  render() {
    const { separateTypes, includeIds, includeTitles } = this.state
    const { columns, dataSource } = this

    const doExport = {
      title: l`Export`,
      action: () => { this.doExport() },
    }

    const columnTitles = columns.map(column => <span className={S.columnTitle} key={`column_title_${column}`}>{ columnTitle(column) }</span>)

    return (
      <Basic title={l`Export Products`} onContinue={doExport} onClose={closeDialog}>
        <div className={S.container}>
          <div className={S.options}>
            <span className={S.optionsTitle}>{l`Options`}</span>
            <div className={S.option}>
              <Checkbox defaultValue={separateTypes} onChange={separateTypes => this.setState({ separateTypes })}>
                {l`Separate types`}
              </Checkbox>
              <Tooltip className={S.info} title={separateTypes ? l`Product types will be split into different files` : l`Product type will be included in each row`}>
                <Icon className={S.tooltip} name='info_outline' />
              </Tooltip>
            </div>
            <div className={S.option}>
              <Checkbox defaultValue={includeIds} onChange={includeIds => this.setState({ includeIds })}>
                {l`Include IDs`}
              </Checkbox>
              <Tooltip className={S.info} title={l`Including IDs makes it much easier to import your products again later!`}>
                <Icon className={S.tooltip} name='info_outline' />
              </Tooltip>
            </div>
            <div className={S.option}>
              <Checkbox defaultValue={includeTitles} onChange={includeTitles => this.setState({ includeTitles })}>
                {l`Include titles`}
              </Checkbox>
            </div>
          </div>
          <div className={S.preview}>
            <Grid columns={columns.length} className={S.grid}>
              { (separateTypes ? [...separate.call(dataSource, 'type')] : [['', dataSource]])
                  .map(([name, items]) => [name, items.map(data(columns))])
                  .map(([name, items]) => [name, includeTitles ? [columnTitles, ...items] : items])
                  .map(([name, items]) => [name ? <span className={S.fileName} style={{gridColumnEnd: `span ${columns.length}`}} key={`file_name_${name}`}>{name}</span> : null, items])
              }
            </Grid>
          </div>
        </div>
      </Basic>
    )
  }
}
