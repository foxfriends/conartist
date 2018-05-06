/* @flow */
import * as React from 'react'
import { Bar } from 'react-chartjs-2'

import Map from '../../../util/default-map'
import { ChartCard } from './card'
import { NotEnoughData } from './not-enough-data'
import { SecondaryCard } from '../../card-view/secondary-card'
import { Select } from '../../../common/select'
import { l, localize } from '../../../localization'
import type { ProductType } from '../../../model/product-type'
import type { Product } from '../../../model/product'
import type { Record } from '../../../model/record'
import S from './chart.css'

export type Props = {
  productTypes: ProductType[],
  products: Product[],
  records: Record[],
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
    const { products, productTypes, records, showSettings } = this.props
    const { metric } = this.state

    const count = new Map([], 0)
    switch (metric) {
      case 'Quantity':
        const typeIds = [].concat(...records.map(({ products }) => products))
          .map(productId => products.find(({ id }) => id === productId).typeId)
        for (const typeId of typeIds) {
          count.set(typeId, count.get(typeId) + 1)
        }
        break
      case 'Money':
        // TODO: implement this
        break
      case 'Customers':
        const typeSets = records.map(({ products }) => products)
          .map(productIds => new Set(productIds.map(productId => products.find(({ id }) => id === productId).typeId)))
        for (const typeSet of typeSets) {
          for (const typeId of typeSet) {
            count.set(typeId, count.get(typeId) + 1)
          }
        }
        break
    }

    const data = {
      labels: productTypes.map(({ name }) => name),
      datasets: [{
        backgroundColor: productTypes.map(({ color }) => `#${color.toString(16)}`),
        data: productTypes.map(({ id }) => count.get(id))
      }]
    }

    const options = {
      legend: {
        display: false,
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
          { records.length === 0
            ? <NotEnoughData />
            : null
          }
        </>
        <SecondaryCard anchor={this.ref} title={l`Options`} onClose={() => showSettings(null)}>
          <div className={S.options}>
            <Select
              title={l`Metric`}
              options={['Quantity', 'Customers']}
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
