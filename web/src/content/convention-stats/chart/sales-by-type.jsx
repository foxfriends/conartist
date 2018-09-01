/* @flow */
import * as React from 'react'
import { Bar } from 'react-chartjs-2'

import Map from '../../../util/default-map'
import { calculatePrice } from '../../../util/calculate-price'
import { ChartCard } from './card'
import { NotEnoughData } from './not-enough-data'
import { SecondaryCard } from '../../card-view/secondary-card'
import { Select } from '../../../common/select'
import { l, localize } from '../../../localization'
import { Money } from '../../../model/money'
import { model } from '../../../model'
import type { ProductType } from '../../../model/product-type'
import type { Product } from '../../../model/product'
import type { Record } from '../../../model/record'
import type { Price } from '../../../model/price'
import S from './chart.css'

export type Props = {
  productTypes: ProductType[],
  products: Product[],
  records: Record[],
  prices: Price[],
  showSettings: (React.Node) => void,
}

export type State = {
  metric: 'Quantity' | 'Money' | 'Customers',
}

export class SalesByTypeChart extends React.Component<Props, State> {
  // $FlowIgnore
  ref: React.Ref<HTMLDivElement>
  constructor(props: Props) {
    super(props)
    // $FlowIgnore
    this.ref = { current: null }
    this.state = {
      metric: 'Quantity',
    }
  }

  render() {
    const { products, productTypes, records, prices, showSettings } = this.props
    const { metric } = this.state

    const count = new Map([], 0)
    switch (metric) {
      case 'Quantity': {
        const typeIds = [].concat(...records.map(({ products }) => products))
          .map(productId => products.find(({ id }) => id === productId))
          .filter(x => x)
          // $FlowIgnore
          .map(({ typeId }) => typeId)
        for (const typeId of typeIds) {
          count.set(typeId, count.get(typeId) + 1)
        }
        break
      }
      case 'Money': {
        const moneyPerType = records.reduce((types, { products: sold, price }) => {
          const soldProducts = sold.map(product => products.find(({ id }) => id === product)).filter(x => x)
          // $FlowIgnore
          const totalPrice = calculatePrice(soldProducts, prices)
          const ratio = price.amount / totalPrice.amount
          const productsByType = soldProducts.reduce((types, product) =>
            types.set(product.typeId, [...types.get(product.typeId), product])
          , new Map([], []))
          const pricesByType = [...productsByType].map(([typeId, soldProducts]) =>
            [typeId, calculatePrice(soldProducts, prices).multiply(ratio)]
          )
          for (const [typeId, price] of pricesByType) {
            types.set(typeId, types.get(typeId).add(price))
          }
          return types
        }, new Map([], Money.zero))
        for (const [type, money] of moneyPerType) {
          count.set(type, money.amount)
        }
        break
      }
      case 'Customers': {
        const typeSets = records.map(({ products }) => products)
          .map(productIds => productIds.map(productId => products.find(({ id }) => id === productId)))
          // $FlowIgnore
          .map(products => new Set(products.filter(x => x).map(({ typeId }) => typeId)))
        for (const typeSet of typeSets) {
          for (const typeId of typeSet) {
            count.set(typeId, count.get(typeId) + 1)
          }
        }
        break
      }
    }

    const data = {
      labels: productTypes.map(({ name }) => name),
      datasets: [{
        backgroundColor: productTypes.map(({ color }) => `#${(color || 0xffffff).toString(16).padStart(6, '0')}`),
        data: productTypes.map(({ id }) => count.get(id))
      }]
    }

    const options = {
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: ({ yLabel }) => {
            if (metric === 'Money') {
              return new Money(model.getValue().settings.currency, yLabel)
            } else {
              return yLabel
            }
          },
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              callback: label => {
                if (metric === 'Money') {
                  return new Money(model.getValue().settings.currency, label)
                } else {
                  return label
                }
              },
            },
            scaleLabel: {
              display: true,
              labelString: localize(metric),
            },
          },
        ],
      },
    }

    return (
      <ChartCard title={l`Sales By Type`} showSettings={showSettings} innerRef={card => this.ref.current = card}>
        <>
          <Bar
            data={data}
            width={600}
            height={600}
            options={options}
            />
          { records.length === 0 || productTypes.length === 0
            ? <NotEnoughData />
            : null
          }
        </>
        <SecondaryCard anchor={this.ref} title={l`Options`} onClose={() => showSettings(null)}>
          <div className={S.options}>
            <Select
              title={l`Metric`}
              options={['Quantity', 'Money', 'Customers']}
              defaultValue={metric}
              onChange={metric => this.setState({ metric })}
              >
              {localize}
            </Select>
          </div>
        </SecondaryCard>
      </ChartCard>
    )
  }
}
