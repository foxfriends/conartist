/* @flow */
import * as React from 'react'
import saveAs from 'save-as'
import Zip from 'jszip'
import moment from 'moment'

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
import { l, localize } from '../../localization'
import { separate } from '../../util/iterable'
import type { Convention } from '../../model/convention'
import S from './index.css'

export type Props = {
  name: 'export',
  type: 'records',
  convention: Convention,
}

type RecordData = Object

type Column = string

type State = {
  typeFormat: 'Hidden' | 'Condensed' | 'Rows' | 'Columns',
  includeInfo: boolean,
  separateDays: boolean,
  includeTitles: boolean,
}

function columnTitle(column: Column): string {
  switch (column) {
    case 'products':  return l`Products`
    case 'price':     return l`Price`
    case 'type':      return l`Product Type`
    case 'time':      return l`Time`
    case 'info':      return l`Note`
  }
  return column
}

function data(columns: Column[]): (RecordData) => React.Node {
  return record => columns.map(column =>
    <span className={S.cell} key={`column_${column}_${record.id}`}>
      { record[column] }
    </span>
  )
}

function formatDay(date: Date): string {
  return moment(date).format(l`MMM. d, yyyy`)
}

function formatTime(date: Date): string {
  return moment(date).format(l`MMMM d yyyy. h:mma`)
}

export class ExportRecords extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      typeFormat: 'Columns',
      includeInfo: false,
      separateDays: false,
      includeTitles: true,
    }
  }

  get columns(): Column[] {
    const { convention } = this.props
    const { typeFormat, includeInfo } = this.state
    const productColumns = (() => {
      if (typeFormat === 'Hidden' || typeFormat === 'Condensed') {
        return ['products']
      } else if (typeFormat === 'Rows') {
        return ['products', 'type']
      } else if (typeFormat === 'Columns') {
        // $FlowIgnore
        return convention.productTypes.map(type => type.name)
      } else {
        throw new Error('Unreachable case');
      }
    })()
    return [
      'time',
      ...productColumns,
      'price',
      // $FlowIgnore
      includeInfo ? 'info' : null,
    ].filter(x => x)
  }

  get dataSource(): RecordData[] {
    const { convention } = this.props
    const { typeFormat } = this.state
    // $FlowIgnore
    const { records, products: rawProducts, productTypes } = convention
    const products = rawProducts
      .map(({ typeId, ...product }) => ({ ...product, type: productTypes.find(type => type.id === typeId) }))
      .map(({ type, ...product }) => ({ ...product, type: type ? type.name : l`Unknown` }))
    return [].concat(
      ...records
        // $FlowIgnore
        .map(({ products: sold, ...record }) => ({ ...record, products: sold.map(id => products.find(product => product.id === id)) }))
        .map(({ price, ...record }) => ({ ...record, price: price.toString() }))
        .map(({ products, ...record }) => ({ ...record, products: products.filter(x => x) }))
        .map(({ time, ...record }) => ({ ...record, time: formatTime(time), day: formatDay(time) }))
        .map(({ products, ...record }) => {
          switch (typeFormat) {
            case 'Hidden':
              return [{
                ...record,
                // $FlowIgnore
                products: products.map(({ name }) => name).join('; '),
              }]
            case 'Condensed':
              return [{
                ...record,
                // $FlowIgnore
                products: products.map(({ name, type }) => `${name} (${type})`).join('; '),
              }]
            case 'Rows':
              return [...separate.call(products, 'type')]
                .map(([type, products]) => [type, products.map(({ name }) => name).join('; ')])
                .map(([type, products]) => ({ ...record, type, products }))
            case 'Columns':
              const productsByType = new Map(
                [...separate.call(products, 'type')]
                  .map(([type, products]) => [type, products.map(({ name }) => name).join('; ')])
              )
              const types = productTypes.reduce((acc, { name }) => {
                acc[name] = productsByType.get(name) || []
                return acc
              }, {})
              return [{
                ...types,
                ...record,
              }]
            default:
              throw new Error('Unreachable case')
          }
        })
    )
  }

  async doExport() {
    const { columns, dataSource } = this
    const { separateDays, includeTitles } = this.state
    const files: [string, Blob][] = ((separateDays ? [...separate.call(dataSource, 'day')] : [['records', dataSource]]))
      .map(([name, file]) => [name, file.map(item => columns.map(column => item[column].toString()))])
      .map(([name, file]) => [name, file.map(item => item.join(','))])
      .map(([name, file]) => [name, includeTitles ? [columns.map(columnTitle).join(','), ...file] : file])
      .map(([name, file]) => [name, file.join('\n') + '\n'])
      .map(([name, file]) => [name, new Blob([file], { type: 'text/plain;charset=utf-8' })])
    if (separateDays) {
      const zip = new Zip()
      for (const [name, blob] of files) {
        zip.file(`${name}.csv`, blob)
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, `${l`Records`.toLowerCase()}.zip`)
    } else {
      const [[name, blob]] = files
      saveAs(blob, `${name}.csv`)
    }
  }

  render() {
    const { separateDays, typeFormat, includeInfo, includeTitles } = this.state
    const { columns, dataSource } = this

    const doExport = {
      title: l`Export`,
      action: () => { this.doExport() },
    }

    const columnTitles = columns.map(column => <span className={S.columnTitle} key={`column_title_${column}`}>{ columnTitle(column) }</span>)

    return (
      <Basic title={l`Export Records`} onContinue={doExport} onClose={closeDialog}>
        <div className={S.container}>
          <div className={S.options}>
            <span className={S.optionsTitle}>{l`Options`}</span>
            <div className={S.option}>
              <Checkbox defaultValue={separateDays} onChange={separateDays => this.setState({ separateDays })}>
                {l`Separate days`}
              </Checkbox>
              <Tooltip className={S.info} title={separateDays ? l`Days will be split into different files` : l`All records will be in one file`}>
                <Icon className={S.tooltip} name='info_outline' />
              </Tooltip>
            </div>
            <div className={S.option}>
              <Checkbox defaultValue={includeInfo} onChange={includeInfo => this.setState({ includeInfo })}>
                {l`Include notes`}
              </Checkbox>
            </div>
            <div className={S.option}>
              <Checkbox defaultValue={includeTitles} onChange={includeTitles => this.setState({ includeTitles })}>
                {l`Include titles`}
              </Checkbox>
            </div>
            <div className={S.option}>
              <Select className={S.select} title={l`Product type format`} options={['Hidden', 'Rows', 'Columns', 'Condensed']} defaultValue={typeFormat} onChange={typeFormat => this.setState({ typeFormat })}>
                {value => localize(value)}
              </Select>
            </div>
          </div>
          <div className={S.preview}>
            <Grid columns={columns.length} className={S.grid} style={{ width: 200 * columns.length }}>
              { (separateDays ? [...separate.call(dataSource, 'day')] : [['', dataSource]])
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
