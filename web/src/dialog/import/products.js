/* @flow */
import * as React from 'react'
import { map } from 'rxjs/operators'
import { forkJoin } from 'rxjs'

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
import { separate, dedup } from '../../util/iterable'
import * as toast from '../../toast';
import { getFile, fileToString, Cancelled } from '../../util/file'
import { SaveProduct } from '../../api/save-product'
import { batchResponses } from '../../api/util'
import { editableProduct, uniqueProductId } from '../../content/edit-products/schema'
import * as update from '../../update/edit-products'
import { closeDialog as doCloseDialog } from '../../update/dialog'

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
  includesTitle: boolean,
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

class UnknownProduct extends Error {
  constructor(id) {
    super()
    this.id = id
  }
}

class UnknownProductType extends Error {
  constructor(name) {
    super()
    this.name = name
  }
}

class ChangedProductType extends Error {
  constructor(product) {
    super()
    this.product = product
  }
}

class SaveFailed extends Error {
  constructor(error) {
    super()
    this.error = error
  }
}

export class ImportProducts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      includeIds: true,
      includesTitle: true,
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

  processRow([a, b, c, d]: string[]): [number | null, ProductType, string, number] {
    const { includeIds, productType } = this.state
    const { products, productTypes } = model.getValue()
    if (includeIds && productType) {
      if (a) {
        const product = products.find(({ id }) => id === +a);
        if (!product) { throw new UnknownProduct(a) }
        if (product.typeId !== productType.id) { throw new ChangedProductType(product) }
      }
      return [a ? +a : null, productType, b, +c]
    } else if (includeIds) {
      const type = productTypes.find(({ name }) => name === b)
      if (!type) { throw new UnknownProductType(b) }
      if (a) {
        const product = products.find(({ id }) => id === +a)
        if (!product) { throw new UnknownProduct(a) }
        if (product.typeId !== type.id) { throw new ChangedProductType(product) }
      }
      return [a ? +a : null, type, c, +d]
    } else if (productType) {
      const product = products.find(({ name, typeId }) => name === a && typeId === productType.id)
      return [product ? product.id : null, productType, a, +b]
    } else {
      const type = productTypes.find(({ name }) => name === a)
      if (!type) { throw new UnknownProductType(a) }
      const product = products.find(({ name, typeId }) => name === b && typeId === type.id)
      return [product ? product.id : null, type, b, +c]
    }
  }

  async doImport() {
    const { includesTitle } = this.state
    try {
      const data = await getFile({ accept: 'text/csv' }).then(fileToString)
      const lines = data.split('\n').filter(line => line)
      if (includesTitle) { lines.shift() }
      const rows = lines
        .map(line => line.split(',').map(str => str.trim()))
        .filter(dedup(row => row.slice(0, -1).join(',')))
      const { products: originalProducts, productTypes } = model.getValue()
      const products = originalProducts.map(editableProduct())

      for (const [id, type, name, quantity] of rows.map(row => this.processRow(row))) {
        if (id === null) {
          products.push({
            product: null,
            id: uniqueProductId(),
            typeId: type.id,
            name: name,
            quantity: quantity,
            sort: originalProducts.filter(product => product.typeId === type.id).length,
            discontinued: false,
          })
        } else {
          const index = products.findIndex(product => product.id === id)
          products[index] = {
            ...products[index],
            name,
            quantity,
          }
        }
      }
      const { state, value, error } = await forkJoin(...products.map(product => new SaveProduct().send(product)))
        .pipe(map(batchResponses))
        .toPromise()
      switch (state) {
        case 'retrieved':
          update.setProducts(value)
          toast.show(<span>{l`Products imported successfully`}</span>)
          doCloseDialog()
          break
        case 'failed':
          throw new SaveFailed(error)
      }
    } catch (error) {
      if (!(error instanceof Cancelled)) {
        throw error;
      }
    }
  }

  render() {
    const { productType, includeIds, includesTitle } = this.state
    const { columns, dataSource } = this
    const { productTypes } = model.getValue()

    const doImport = {
      title: l`Import`,
      action: async () => {
        try {
          await this.doImport()
        } catch (error) {
          switch (true) {
            case error instanceof UnknownProduct:
              toast.show(<span>{l`Import failed: Could not find product with id ${error.id}`}</span>)
              break
            case error instanceof UnknownProductType:
              toast.show(<span>{l`Import failed: Could not find product type named ${error.name}`}</span>)
              break
            case error instanceof ChangedProductType:
              toast.show(<span>{l`Import failed: Cannot change the type of ${error.product.name}`}</span>)
              break
            case error instanceof SaveFailed:
              toast.show(<span>{l`Import failed: Failed to save products. Please try again later!`}</span>)
              break
            default:
              console.error(error)
              toast.show(<span>{l`Import failed: Unknown error`}</span>)
              break
          }
        }
      },
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
              <Checkbox defaultValue={includesTitle} onChange={includesTitle => this.setState({ includesTitle })}>
                {l`Includes titles`}
              </Checkbox>
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
                  .map(([name, items]) => [name, includesTitle ? [columnTitles, ...items] : items])
                  .map(([name, items]) => [name ? <span className={S.fileName} style={{gridColumnEnd: `span ${columns.length}`}} key={`file_name_${name}`}>{name}</span> : null, items])
              }
            </Grid>
          </div>
        </div>
      </Basic>
    )
  }
}
