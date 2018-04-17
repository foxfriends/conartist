/* @flow */
import * as React from 'react'
import DefaultMap from '../../util/default-map'
import { l, lx } from '../../localization'
import { CardView } from '../card-view'
import { Card } from '../card-view/card'
import { EditProductCard } from './edit-product-card'
import { Input } from '../../common/input'
import { uniqueTypeId, uniqueProductId, peekTypeId } from './schema'
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
}

export class EditProducts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      products: this.props.products.map(product => ({ ...product, product })),
      productTypes: this.props.productTypes.map(productType => ({ ...productType, productType })),
    }
  }

  handleProductTypeNameChange(id: Id, name: string) {
    const productTypes =
      this.state.productTypes.map(productType => productType.id === id
        ? { ...productType, name }
        : productType)

    this.setState({ productTypes })
  }

  handleProductNameChange(id: Id, name: string) {
    const products =
      this.state.products.map(product => product.id === id
        ? { ...product, name }
        : product)

    this.setState({ products })
  }

  handleProductQuantityChange(id: Id, quantityStr: string) {
    const quantity = parseInt(quantityStr, 10)
    if (!isNaN(quantity)) {
      const products =
        this.state.products.map(product => product.id === id
          ? { ...product, quantity }
          : product)

      this.setState({ products })
    }
  }

  handleProductTypeDiscontinue(id: Id) {
    if (typeof id === 'string') {
      const products = this.state.products.filter(product => product.typeId !== id)
      const productTypes = this.state.productTypes.filter(productType => productType.id !== id)
      this.setState({ products, productTypes })
    } else {
      const productTypes = this.state.productTypes.map(productType => productType.id === id ? { ...productType, discontinued: true } : productType)
      this.setState({ productTypes })
    }
  }

  handleProductDiscontinue(id: Id) {
    if (typeof id === 'string') {
      const products = this.state.products.filter(product => product.id !== id)
      this.setState({ products })
    } else {
      const products = this.state.products.map(product => product.id === id ? { ...product, discontinued: true } : product)
      this.setState({ products })
    }
  }

  createProductType(name: string) {
    if (name !== '' && !this.state.productTypes.some(existing => existing.name === name)) {
      const newProductType: EditableProductType = {
        productType: null,
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
      id: uniqueProductId(),
      typeId,
      name: '',
      quantity: 0,
      discontinued: false,
    }
    const products = [...this.state.products, newProduct]
    this.setState({ products })
  }

  render() {
    const { products, productTypes } = this.state
    const sortedProducts = products
      .reduce(
        (sortedProducts, product) => sortedProducts.set(product.typeId, [...sortedProducts.get(product.typeId), product]),
        new DefaultMap([], [])
      )

    const dataSource = productTypes
      .map(productType => [ productType, sortedProducts.get(productType.id) ])

    const removeProductType = typeId => ({
      title: 'remove',
      action: () => this.handleProductTypeDiscontinue(typeId),
    })

    const addProduct = typeId => ({
      title: 'add',
      action: () => this.createProduct(typeId),
    })

    return (
      <CardView dataSource={dataSource}>
        <Fragment />
        {([ productType, products ]) =>
            <EditProductCard
              productType={productType}
              products={products}
              topAction={removeProductType(productType.id)}
              bottomAction={addProduct(productType.id)}
              onProductTypeNameChange={name => this.handleProductTypeNameChange(productType.id, name)}
              onProductNameChange={(id, name) => this.handleProductNameChange(id, name)}
              onProductQuantityChange={(id, name) => this.handleProductQuantityChange(id, name)}
              onProductDiscontinue={id => this.handleProductDiscontinue(id)}
              key={`product_type_${productType.id}`}/> }
        <Card className={S.newProductType}>
          <Fragment key={`product_type_${peekTypeId()}`}>
            <Input className={S.productTypeName} placeholder={l`New product type`} onSubmit={name => this.createProductType(name)} autoFocus />
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
    )
  }
}
