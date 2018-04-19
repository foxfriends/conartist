/* @flow */
import * as React from 'react'
import * as ReactX from '../../react-ext'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import type { Subscription } from 'rxjs/Subscription'

import { forkJoin } from 'rxjs/observable/forkJoin'
import { merge } from 'rxjs/observable/merge'

import { tap, filter, pluck, map, mapTo, switchMap, takeUntil, share, partition } from 'rxjs/operators'

import DefaultMap from '../../util/default-map'
import { by, Asc, Desc } from '../../util/sort'
import { l, lx } from '../../localization'
import { CardView } from '../card-view'
import { Card } from '../card-view/card'
import { EditProductCard } from './edit-product-card'
import { Input } from '../../common/input'
import { Cover } from '../../common/cover'
import { events, SaveProducts } from '../../event'
import { SaveProductType } from '../../api/save-product-type'
import { SaveProduct } from '../../api/save-product'
import { batchResponses } from '../../api/util'
import { status as toolbarStatus } from '../../toolbar'
import * as toolbarAction from '../../toolbar/action'
import * as navigate from '../../update/navigate'
import * as update from '../../update/edit-products'
import {
  uniqueTypeId,
  uniqueProductId,
  peekTypeId,
  setProductTypeIds,
  editableProduct,
  editableProductType,
  nonEditableProduct,
  nonEditableProductType,
  NonNumberQuantity,
  NonIntegerQuantity,
  NegativeQuantity,
  DuplicateName,
} from './schema'
import { VALID, INVALID, EMPTY } from '../../model/validation'
import type { Product } from '../../model/product'
import type { ProductType } from '../../model/product-type'
import type { Id, EditableProduct, EditableProductType } from './schema'
import S from './index.css'
const { Fragment } = React

export type Props = {
  name: 'edit-products',
  products: Product[],
  productTypes: ProductType[],
}

type State = {
  products: EditableProduct[],
  productTypes: EditableProductType[],
  editingEnabled: boolean,
}

type Validatable = {
  productTypes?: EditableProductType[],
  products?: EditableProduct[],
}

const defaultToolbar = { primary: toolbarAction.SaveProducts, secondary: toolbarAction.Discard }

export class EditProducts extends ReactX.Component<Props, State> {
  static getDerivedStateFromProps({ products, productTypes }: Props, state: State) {
    if (!state || (state.products.length === 0 && state.productTypes.length === 0)) {
      return {
        products: products.map(editableProduct),
        productTypes: productTypes.map(editableProductType),
      }
    } else {
      return null
    }
  }

  constructor(props: Props) {
    super(props)

    toolbarStatus.next(defaultToolbar)

    this.state = {
      products: this.props.products.map(editableProduct),
      productTypes: this.props.productTypes.map(editableProductType),
      editingEnabled: true,
    }

    const saveButtonPressed = events
      .pipe(
        takeUntil(this.unmounted),
        filter(event => event === SaveProducts),
        share(),
      )

    const [savedProductTypes, savingProductTypes] = saveButtonPressed
      .pipe(
        map(() => this.state.productTypes),
        switchMap(productTypes =>
          forkJoin(
            ...productTypes.map(productType => new SaveProductType().send(productType)),
          )
        ),
        map(batchResponses),
        share(),
        partition(({ state }) => state === 'retrieved'),
      )

    const [savedProducts, savingProducts] = savedProductTypes
      .pipe(
        pluck('value'),
        tap(productTypes => update.setProductTypes(productTypes.map(nonEditableProductType))),
        map(productTypes => setProductTypeIds(this.state.products, productTypes)),
        tap(products => this.setState({ products })),
        switchMap(products =>
          forkJoin(
            ...products.map(product => new SaveProduct().send(product)),
          )
        ),
        map(batchResponses),
        share(),
        partition(({ state }) => state === 'retrieved'),
      )

    savedProducts
      .pipe(
        pluck('value'),
        tap(products => update.setProducts(products.map(nonEditableProduct))),
      )
      .subscribe(() => navigate.products())

    const saveFailed = merge(savingProductTypes, savingProducts)
      .pipe(
        filter(({ state }) => state === 'failed'),
        share(),
      )

    saveFailed.pipe(mapTo(false)).subscribe(editingEnabled => this.setState({ editingEnabled }))

    merge(saveButtonPressed.pipe(mapTo(false)), saveFailed.pipe(mapTo(true)))
      .pipe(
        map(enabled => ({ ...defaultToolbar, primary: { ...defaultToolbar.primary, enabled } }))
      )
      .subscribe(status => toolbarStatus.next(status))
  }

  handleProductTypeNameChange(id: Id, name: string) {
    const productTypes =
      this.state.productTypes.map(productType => productType.id === id
        ? { ...productType, name }
        : productType
      )

    this.setState(this.validate({ productTypes }))
  }

  handleProductNameChange(id: Id, name: string) {
    const products =
      this.state.products.map(product => product.id === id
        ? { ...product, name }
        : product
      )

    this.setState(this.validate({ products }))
  }

  handleProductQuantityChange(id: Id, quantityStr: string) {
    const quantity = Number(quantityStr)

    const products =
      this.state.products.map(product => product.id === id
        ? { ...product, quantity }
        : product
      )

    this.setState(this.validate({ products }))
  }

  handleProductTypeDiscontinueToggled(id: Id) {
    if (typeof id === 'string') {
      const products = this.state.products.filter(product => product.typeId !== id)
      const productTypes = this.state.productTypes.filter(productType => productType.id !== id)
      this.setState(this.validate({ products, productTypes }))
    } else {
      const productTypes = this.state.productTypes.map(productType => productType.id === id ? { ...productType, discontinued: !productType.discontinued } : productType)
      this.setState(this.validate({ productTypes }))
    }
  }

  handleProductDiscontinueToggled(id: Id) {
    if (typeof id === 'string') {
      const products = this.state.products.filter(product => product.id !== id)
      this.setState(this.validate({ products }))
    } else {
      const products = this.state.products.map(product => product.id === id ? { ...product, discontinued: !product.discontinued } : product)
      this.setState(this.validate({ products }))
    }
  }

  createProductType(name: string) {
    if (name !== '' && !this.state.productTypes.some(existing => existing.name === name)) {
      const newProductType: EditableProductType = {
        productType: null,
        validation: { state: VALID },
        id: uniqueTypeId(),
        name,
        color: 0xffffff,
        discontinued: false,
      }
      const productTypes = [...this.state.productTypes, newProductType]
      this.setState({ productTypes })
    }
  }

  createProduct(typeId: Id) {
    const newProduct = {
      product: null,
      validation: { state: EMPTY },
      id: uniqueProductId(),
      typeId,
      name: '',
      quantity: 0,
      discontinued: false,
    }
    const products = [...this.state.products, newProduct]
    this.setState({ products })
  }

  validate({ productTypes, products }: Validatable): Validatable {
    const validatedProductTypes = productTypes && (() => {
      const usedNames = new Set()
      return productTypes.map(productType => {
        if (productType.name === '') {
          return { ...productType, validation: { state: EMPTY } }
        }
        if (usedNames.has(productType.name)) {
          return { ...productType, validation: { state: INVALID, error: DuplicateName } }
        }
        usedNames.add(productType.name)
        return { ...productType, validation: { state: VALID } }
      })
    })()

    const validatedProducts = products && (() => {
      const usedNames = new Set()
      return products.map(product => {
        if (product.name === '') {
          return { ...product, validation: { state: EMPTY } }
        }
        if (usedNames.has(product.name)) {
          return { ...product, validation: { state: INVALID, error: DuplicateName } }
        }
        usedNames.add(product.name)
        if (isNaN(product.quantity)) {
          return { ...product, validation: { state: INVALID, error: NonNumberQuantity } }
        }
        if (product.quantity !== Math.floor(product.quantity)) {
          return { ...product, validation: { state: INVALID, error: NonIntegerQuantity } }
        }
        if (product.quantity < 0) {
          return { ...product, validation: { state: INVALID, error: NegativeQuantity } }
        }
        return { ...product, validation: { state: VALID } }
      })
    })()

    return { productTypes: validatedProductTypes || this.state.productTypes, products: validatedProducts || this.state.products }
  }

  render() {
    const { products, productTypes, editingEnabled } = this.state
    const sortedProducts = [...products]
      .sort(by(['discontinued', Desc], ['id', Asc]))
      .reduce(
        (sortedProducts, product) => sortedProducts.set(product.typeId, [...sortedProducts.get(product.typeId), product]),
        new DefaultMap([], []),
      )

    const dataSource = [...productTypes]
      .sort(by(['discontinued', Desc], ['id', Asc]))
      .map(productType => [ productType, sortedProducts.get(productType.id) ])

    const toggleDiscontinueProductType = ({ id, discontinued }) => ({
      title: discontinued ? 'add' : 'remove',
      action: () => this.handleProductTypeDiscontinueToggled(id),
    })

    const addProduct = ({ id }) => ({
      title: 'add',
      action: () => this.createProduct(id),
    })

    return (
      <Fragment>
        <CardView dataSource={dataSource}>
          <Fragment />
          {([ productType, products ]) =>
              <EditProductCard
                productType={productType}
                products={products}
                topAction={toggleDiscontinueProductType(productType)}
                bottomAction={addProduct(productType)}
                onProductTypeNameChange={name => this.handleProductTypeNameChange(productType.id, name)}
                onProductNameChange={(id, name) => this.handleProductNameChange(id, name)}
                onProductQuantityChange={(id, name) => this.handleProductQuantityChange(id, name)}
                onProductToggleDiscontinue={id => this.handleProductDiscontinueToggled(id)}
                key={`product_type_${productType.id}`}
                />
          }
          <Card className={S.newProductType}>
            <Fragment key={`product_type_${peekTypeId()}`}>
              <Input className={S.productTypeName} placeholder={l`New product type`} onSubmit={name => this.createProductType(name)} />
            </Fragment>
            <Fragment>
              { productTypes.length === 0
                  ? <div className={S.placeholder}>
                      {lx`<First product type message>`(_ => _)}
                    </div>
                  : null
              }
            </Fragment>
          </Card>
        </CardView>
        { editingEnabled ? null : <Cover /> }
      </Fragment>
    )
  }
}
