/*       */
import * as React from 'react'
import * as ReactX from '../../react-ext'
import { Observable, Subject, forkJoin, merge, of } from 'rxjs'
import { tap, filter, pluck, map, mapTo, switchMap, takeUntil, share, partition, defaultIfEmpty } from 'rxjs/operators'
                                        

import DefaultMap from '../../util/default-map'
import Set from '../../util/set'
import { by, Asc, Desc } from '../../util/sort'
import { l, lx } from '../../localization'
import { AutoCardView as CardView } from '../card-view/auto'
import { Card } from '../card-view/card'
import { Input } from '../../common/input'
import { Cover } from '../../common/cover'
import { EditPricesCard } from './edit-prices-card'
import { events, SavePrices } from '../../event'
import { SavePrice } from '../../api/save-price'
import { batchResponses } from '../../api/util'
import { status as toolbarStatus } from '../../toolbar'
import * as toolbarAction from '../../toolbar/action'
import * as navigate from '../../update/navigate'
import * as update from '../../update/edit-prices'
import {
  priceId,
  editablePrice,
  nonEditablePrice,
  hasher,
  DuplicateQuantity,
  NonNumberQuantity,
  NonIntegerQuantity,
  NegativeQuantity,
  NonNumberPrice,
  NegativePrice,
} from './schema'
import { VALID, INVALID, EMPTY } from '../../model/validation'
import { Money } from '../../model/money'
                                                       
                                                        
                                              
                                                  
                                                           
                                                              
import S from './index.css'
const { Fragment } = React

                     
                      
                  
                      
                              
 

              
                          
                          
                                                                                                                          
 

const defaultToolbar = { primary: toolbarAction.SavePrices, secondary: toolbarAction.DiscardPrices }

function enableSave() {
  toolbarStatus.next(defaultToolbar)
}

function disableSave() {
  toolbarStatus.next({ ...defaultToolbar, primary: { ...defaultToolbar.primary, enabled: false } })
}

function diff(before         , after                 )                              {
  const initial                     = new Map()
  before.forEach(price => initial.set(hasher(price), price))

  const final                             = new Map()
  after.forEach(price => final.set(hasher(price), price))

  const deleted = new Set(initial.keys()).difference(final.keys())
  const changed = new Set(
    [...final]
      .filter(([key, value]) => {
        const base = initial.get(key)
        return !(base && base.price.equals(value.price))
      })
      .map(([key, _]) => key)
  )
  const kept = new Set(initial.keys()).intersection(final.keys())
  const unchanged = kept.difference(changed)
  // $FlowIgnore: it's not null
  const keeps          = [...unchanged].map(key => initial.get(key))
  // $FlowIgnore: it's not null
  const deletes           = [...deleted].map(key => initial.get(key)).map(price => ({ operation: 'delete', price }))
  // $FlowIgnore: it's not null
  const adds        = [...changed].map(key => final.get(key)).map(price => ({ operation: 'add', price }))
  return [keeps, [].concat(deletes, adds)]
}

export class EditPrices extends ReactX.Component               {
  static getDerivedStateFromProps({ prices }       , state       )                 {
    if (!state || !state.hadPrices) {
      return {
        prices: prices
          .sort(by(['typeId', Asc], ['productId', Asc, Desc], ['quantity', Asc]))
          .map(editablePrice),
        hadPrices: prices.length != 0,
      }
    } else {
      return null
    }
  }

  constructor(props       ) {
    super(props)

    toolbarStatus.next(defaultToolbar)

    this.state = {
      prices: this.props.prices
        .sort(by(['typeId', Asc], ['productId', Asc, Desc], ['quantity', Asc]))
        .map(editablePrice),
      editingEnabled: true,
      hadPrices: this.props.prices.length != 0,
    }

    const saveButtonPressed = events
      .pipe(
        takeUntil(this.unmounted),
        filter(event => event === SavePrices),
        share(),
      )

    const [savedPrices, savingPrices] = saveButtonPressed
      .pipe(
        map(() => diff(this.props.prices, this.state.prices)),
        switchMap(([prices, changes]) =>
          forkJoin(
            of(prices),
            forkJoin(...changes.map(price => new SavePrice().send(price)))
              .pipe(defaultIfEmpty([])),
          )
        ),
        map(([prices, changes]) => [prices, batchResponses(changes)]),
        share(),
        partition(([_, { state }]) => state === 'retrieved'),
      )

    savedPrices
      .pipe(
        map(([prices, { value: changed }]) => [].concat(prices, changed.filter(price => price))),
        tap(prices => update.setPrices(prices)),
      )
      .subscribe(() => navigate.prices())

    const saveFailed = savingPrices
      .pipe(
        map(([_, response]) => response),
        filter(({ state }) => state === 'failed'),
      )

    const enabled = merge(saveButtonPressed.pipe(mapTo(false)), saveFailed.pipe(mapTo(true)))
      .pipe(share())

    enabled.subscribe(editingEnabled => this.setState({ editingEnabled }))

    enabled
      .pipe(map(enabled => ({ ...defaultToolbar, primary: { ...defaultToolbar.primary, enabled } })))
      .subscribe(status => toolbarStatus.next(status))
  }

  handleProductIdChange(id        , productId         ) {
    const prices =
      this.state.prices.map(price => price.id === id
        ? { ...price, productId, original: null }
        : price
      )

    this.setState({ prices: this.validate(prices) })
  }

  handleQuantityChange(id        , quantity        ) {
    const prices =
      this.state.prices.map(price => price.id === id
        ? { ...price, quantity: Number(quantity) }
        : price
      )

    this.setState({ prices: this.validate(prices) })
  }

  handlePriceChange(id        , newPrice        ) {
    let money         = null
    try {
      money = Money.parse(newPrice)
    } catch(_) {}

    const prices =
      this.state.prices.map(price => price.id === id
        ? { ...price, price: money }
        : price
      )

    this.setState({ prices: this.validate(prices) })
  }

  handleRemovePrice(id        ) {
    const prices = this.state.prices.filter(price => price.id !== id)
    this.setState({ prices: this.validate(prices) })
  }

  createPrice(typeId        ) {
    const newPrice                = {
      original: null,
      id: priceId(),
      quantityValidation: { state: EMPTY },
      priceValidation: { state: EMPTY },
      typeId,
      productId: null,
      quantity: 0,
      price: Money.zero,
    }
    const prices = [...this.state.prices, newPrice]
    this.setState({ prices, hadPrices: true })
    disableSave()
  }

  validate(prices                 )                  {
    const existingPrices = new DefaultMap([], 0)
    prices
      .map(hasher)
      .forEach(hash => existingPrices.set(hash, existingPrices.get(hash) + 1))

    enableSave()
    return prices.map(price => {
      let quantityValidation                              = { state: VALID }
      let priceValidation                              = { state: VALID }
      if (isNaN(price.quantity)) {
        quantityValidation = { state: INVALID, error: NonNumberQuantity }
      } else if (price.quantity <= 0) {
        quantityValidation = { state: INVALID, error: NegativeQuantity }
      } else if (Math.floor(price.quantity) !== price.quantity) {
        quantityValidation = { state: INVALID, error: NonIntegerQuantity }
      } else if (existingPrices.get(hasher(price)) > 1) {
        quantityValidation = { state: INVALID, error: DuplicateQuantity }
      }
      if (!price.price) {
        priceValidation = { state: INVALID, error: NonNumberPrice }
      } else if (price.price.amount < 0) {
        priceValidation = { state: INVALID, error: NegativePrice }
      }
      if (priceValidation.state === INVALID || quantityValidation.state === INVALID) {
        disableSave()
      }
      return { ...price, priceValidation, quantityValidation }
    })
  }

  render() {
    const { prices, editingEnabled } = this.state
    const { products, productTypes } = this.props
    const sortedPrices = prices
      .reduce(
        (sortedPrices, price) => sortedPrices.set(price.typeId, [...sortedPrices.get(price.typeId), price]),
        new DefaultMap([], [])
      )

    const dataSource = productTypes
      .filter(({ discontinued }) => !discontinued)
      .sort(by(['id', Asc]))
      .map(productType => [ productType, sortedPrices.get(productType.id) ])

    const addPrice = ({ id }) => ({
      title: 'add',
      action: () => this.createPrice(id),
    })

    return (
      <Fragment>
        <CardView dataSource={dataSource}>
          {([ productType, prices ]) =>
              <EditPricesCard
                productType={productType}
                products={products.filter(({ typeId, discontinued }) => !discontinued && typeId === productType.id)}
                prices={prices}
                bottomAction={addPrice(productType)}
                onProductChange={(priceId, productId) => this.handleProductIdChange(priceId, productId)}
                onQuantityChange={(priceId, quantity) => this.handleQuantityChange(priceId, quantity)}
                onPriceChange={(priceId, price) => this.handlePriceChange(priceId, price)}
                onPriceRemove={priceId => this.handleRemovePrice(priceId)}
                key={`product_type_${productType.id}`}
                />
          }
        </CardView>
        { editingEnabled ? null : <Cover /> }
      </Fragment>
    )
  }
}
