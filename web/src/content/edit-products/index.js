/* @flow */
import * as React from 'react'
import * as ReactX from '../../react-ext'
import { Observable, Subject, forkJoin, merge } from 'rxjs'
import { tap, filter, pluck, map, mapTo, switchMap, takeUntil, share, partition } from 'rxjs/operators'
import type { Subscription } from 'rxjs'

import DefaultMap from '../../util/default-map'
import { by, Asc, Desc } from '../../util/sort'
import { l, lx } from '../../localization'
import { AutoCardView as CardView } from '../card-view/auto'
import { Card } from '../card-view/card'
import { EditProductCard } from './edit-product-card'
import { Input } from '../../common/input'
import { Cover } from '../../common/cover'
import { Button } from '../../common/button'
import { reordered as navigationItemReordered } from '../../navigation/item'
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
  hasher,
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
  productTypes: EditableProductType[],
  products: EditableProduct[],
}

const defaultToolbar = { primary: toolbarAction.SaveProducts, secondary: toolbarAction.DiscardProducts }

function enableSave() {
  toolbarStatus.next(defaultToolbar)
}

function disableSave() {
  toolbarStatus.next({ ...defaultToolbar, primary: { ...defaultToolbar.primary, enabled: false } })
}

export class EditProducts extends ReactX.Component<Props, State> {
  static getDerivedStateFromProps({ products, productTypes }: Props, state: State): ?$Shape<State> {
    if (!state || (state.products.length === 0 && state.productTypes.length === 0)) {
      return {
        products: products.sort(by(['discontinued', Desc], ['sort', Asc], ['id', Asc])).map(editableProduct()),
        productTypes: productTypes.sort(by(['discontinued', Desc], ['sort', Asc], ['id', Asc])).map(editableProductType),
      }
    } else {
      return null
    }
  }

  constructor(props: Props) {
    super(props)

    toolbarStatus.next(defaultToolbar)

    this.state = {
      products: this.props.products.sort(by(['discontinued', Desc], ['sort', Asc], ['id', Asc])).map(editableProduct()),
      productTypes: this.props.productTypes.sort(by(['discontinued', Desc], ['sort', Asc], ['id', Asc])).map(editableProductType),
      editingEnabled: true,
    }

    navigationItemReordered
      .pipe(takeUntil(this.unmounted))
      .subscribe(([start, index]) => this.handleProductTypeSortChange(start, index))

    const saveButtonPressed = events
      .pipe(
        takeUntil(this.unmounted),
        filter(event => event === SaveProducts),
        share(),
      )

    const [savedProductTypes, savingProductTypes] = saveButtonPressed
      .pipe(
        map(() => this.state.productTypes),
        switchMap(productTypes => forkJoin(...productTypes.map(productType => new SaveProductType().send(productType)))),
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
        switchMap(products => forkJoin(...products.map(product => new SaveProduct().send(product)))),
        map(batchResponses),
        share(),
        partition(({ state }) => state === 'retrieved'),
      )

    savedProducts
      .pipe(
        pluck('value'),
        tap(products => update.setProducts(products)),
      )
      .subscribe(() => navigate.products())

    const saveFailed = merge(savingProductTypes, savingProducts)
      .pipe(filter(({ state }) => state === 'failed'))

    const enabled = merge(saveButtonPressed.pipe(mapTo(false)), saveFailed.pipe(mapTo(true)))
      .pipe(share())

    enabled.subscribe(editingEnabled => this.setState({ editingEnabled }))

    enabled
      .pipe(map(enabled => ({ ...defaultToolbar, primary: { ...defaultToolbar.primary, enabled } })))
      .subscribe(status => toolbarStatus.next(status))
  }

  handleProductTypeNameChange(id: Id, name: string) {
    const productTypes =
      this.state.productTypes.map(productType => productType.id === id
        ? { ...productType, name }
        : productType
      )

    this.setState(this.validate({ products: this.state.products, productTypes }))
  }

  handleProductTypeColorChange(id: Id, color: number) {
    const productTypes =
      this.state.productTypes.map(productType => productType.id === id
        ? { ...productType, color }
        : productType
      )

    this.setState(this.validate({ products: this.state.products, productTypes }))
  }

  handleProductNameChange(id: Id, name: string) {
    const products =
      this.state.products.map(product => product.id === id
        ? { ...product, name }
        : product
      )

    this.setState(this.validate({ products, productTypes: this.state.productTypes }))
  }

  handleProductQuantityChange(id: Id, quantityStr: string) {
    const quantity = quantityStr !== '' ? Number(quantityStr) : NaN

    const products =
      this.state.products.map(product => product.id === id
        ? { ...product, quantity }
        : product
      )

    this.setState(this.validate({ products, productTypes: this.state.productTypes }))
  }

  handleProductTypeDiscontinueToggled(id: Id) {
    if (typeof id === 'string') {
      const products = this.state.products.filter(product => product.typeId !== id)
      const productTypes = this.state.productTypes.filter(productType => productType.id !== id)
      this.setState(this.validate({ products, productTypes }))
    } else {
      const productTypes = this.state.productTypes.map(productType => productType.id === id ? { ...productType, discontinued: !productType.discontinued } : productType)
      this.setState(this.validate({ products: this.state.products, productTypes }))
    }
  }

  handleProductDiscontinueToggled(id: Id) {
    if (typeof id === 'string') {
      const products = this.state.products.filter(product => product.id !== id)
      this.setState(this.validate({ products, productTypes: this.state.productTypes }))
    } else {
      const products = this.state.products.map(product => product.id === id ? { ...product, discontinued: !product.discontinued } : product)
      this.setState(this.validate({ products, productTypes: this.state.productTypes }))
    }
  }

  handleProductSortChange(typeId: Id, start: number, sort: number) {
    const original = this.state.products
      .filter(product => product.typeId === typeId)
      .sort(by(['discontinued', Desc], ['sort', Asc], ['id', Asc]))[start]
    if (!original) { throw new Error("Trying to edit non-existent product") }
    if (original.sort < sort) {
      sort -= 1
    }
    const products =
      this.state.products.map(product => {
        if (product.id === original.id) {
          return { ...product, sort }
        } else if (product.typeId === original.typeId) {
          if (product.sort >= sort && product.sort < original.sort) {
            return { ...product, sort: product.sort + 1 }
          } else if (product.sort > original.sort && product.sort <= sort) {
            return { ...product, sort: product.sort - 1 }
          }
        }
        return product
      })
    this.setState(this.validate({ products, productTypes: this.state.productTypes }))
  }

  handleProductTypeSortChange(start: number, sort: number) {
    const original = [...this.state.productTypes]
      .sort(by(['discontinued', Desc], ['sort', Asc], ['id', Asc]))[start]
    if (!original) { throw new Error("Trying to edit non-existent product type") }
    if (original.sort < sort) {
      sort -= 1
    }
    const productTypes =
      this.state.productTypes.map(productType => {
        if (productType.id === original.id) {
          return { ...productType, sort }
        } else if (productType.sort >= sort && productType.sort < original.sort) {
          return { ...productType, sort: productType.sort + 1 }
        } else if (productType.sort > original.sort && productType.sort <= sort) {
          return { ...productType, sort: productType.sort - 1 }
        }
        return productType
      })
    this.setState(this.validate({ products: this.state.products, productTypes }))
  }

  createProductType() {
    const newProductType: EditableProductType = {
      productType: null,
      validation: { state: EMPTY },
      id: uniqueTypeId(),
      name: '',
      color: 0xffffff,
      sort: this.state.productTypes.length,
      discontinued: false,
    }
    const productTypes = [...this.state.productTypes, newProductType]
    this.setState({ productTypes })
    disableSave()
  }

  createProduct(typeId: Id) {
    const newProduct = {
      product: null,
      nameValidation: { state: EMPTY },
      quantityValidation: { state: EMPTY },
      id: uniqueProductId(),
      typeId,
      name: '',
      quantity: NaN,
      sort: this.state.products.filter(product => product.typeId === typeId).length,
      discontinued: false,
    }
    const products = [...this.state.products, newProduct]
    this.setState({ products })
    disableSave()
  }

  validate({ productTypes, products }: Validatable): Validatable {
    enableSave()
    const validatedProductTypes = (() => {
      const usedNames = new DefaultMap([], 0)
      productTypes.forEach(({ name }) => usedNames.set(name, usedNames.get(name) + 1))
      return productTypes.map(productType => {
        if (productType.name === '') {
          disableSave()
          return { ...productType, validation: { state: EMPTY } }
        }
        if (usedNames.get(productType.name) > 1) {
          disableSave()
          return { ...productType, validation: { state: INVALID, error: DuplicateName } }
        }
        return { ...productType, validation: { state: VALID } }
      })
    })()

    const validatedProducts = (() => {
      const usedNames = new DefaultMap([], 0)
      products.map(hasher).forEach(product => usedNames.set(product, usedNames.get(product) + 1))
      return products.map(product => {
        let nameValidation = { state: VALID }
        let quantityValidation = { state: VALID }
        if (product.name === '') {
          nameValidation = { state: EMPTY }
        }
        if (usedNames.get(hasher(product)) > 1) {
          nameValidation = { state: INVALID, error: DuplicateName }
        }
        if (isNaN(product.quantity)) {
          quantityValidation = { state: INVALID, error: NonNumberQuantity }
        }
        if (product.quantity !== Math.floor(product.quantity)) {
          quantityValidation = { state: INVALID, error: NonIntegerQuantity }
        }
        if (product.quantity < 0) {
          quantityValidation = { state: INVALID, error: NegativeQuantity }
        }
        if(nameValidation.state !== VALID || quantityValidation.state !== VALID) {
          disableSave()
        }
        return { ...product, nameValidation, quantityValidation }
      })
    })()

    return { productTypes: validatedProductTypes || this.state.productTypes, products: validatedProducts || this.state.products }
  }

  render() {
    const { products, productTypes, editingEnabled } = this.state
    const sortedProducts = [...products]
      .sort(by(['discontinued', Desc], ['sort', Asc], ['id', Asc]))
      .reduce(
        (sortedProducts, product) => sortedProducts.set(product.typeId, [...sortedProducts.get(product.typeId), product]),
        new DefaultMap([], []),
      )

    const dataSource = [...productTypes]
      .sort(by(['discontinued', Desc], ['sort', Asc], ['id', Asc]))
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
          {([ productType, products ], _) =>
              <EditProductCard
                productType={productType}
                products={products}
                topAction={toggleDiscontinueProductType(productType)}
                bottomAction={addProduct(productType)}
                onProductTypeNameChange={name => this.handleProductTypeNameChange(productType.id, name)}
                onProductTypeColorChange={color => this.handleProductTypeColorChange(productType.id, color)}
                onProductNameChange={(id, name) => this.handleProductNameChange(id, name)}
                onProductQuantityChange={(id, quantity) => this.handleProductQuantityChange(id, quantity)}
                onProductToggleDiscontinue={id => this.handleProductDiscontinueToggled(id)}
                onProductReorder={(start, index) => this.handleProductSortChange(productType.id, start, index)}
                key={`product_type_${productType.id}`}
                />
          }
          <Card>
            <Fragment key={`product_type_${peekTypeId()}`}>
              <Button
                className={S.newProductType}
                title={l`New product type`}
                action={() => this.createProductType()}
                priority='tertiary' />
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
