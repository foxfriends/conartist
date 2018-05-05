/* @flow */
import * as React from 'react'
import { Bar } from 'react-chartjs-2'

import Map from '../../../util/default-map'
import { ChartCard } from './card'
import { SecondaryCard } from '../../card-view/secondary-card'
import { l } from '../../../localization'
import type { Product } from '../../../model/product'
import type { Record } from '../../../model/record'

export type Props = {
  products: Product[],
  records: Record[],
  showSettings: (React.Node) => void,
}

export type State = {
  type: ?number,
}

export class InventoryChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      type: null,
    }
  }

  render() {
    // $FlowIgnore
    const ref: React.Ref<HTMLDivElement> = { current: null }

    const { products, records, showSettings } = this.props
    if (products.length === 0 || records.length === 0) {
      // TODO: placeholder
      return null
    }

    const sold = [].concat(...records.map(({ products }) => products))
      .reduce((acc, productId) => acc.set(productId, acc.get(productId) + 1), new Map([], 0))

    const data = {
      labels: products.map(({ name }) => name),
      datasets: [{
        label: 'Sold',
        xAxisId: 'sold',
        backgroundColor: '#ff0000',
        data: products.map(({ id }) => sold.get(id))
      }, {
        label: 'Remaining',
        xAxisId: 'remaining',
        backgroundColor: '#3E803E',
        data: products.map(({ id, quantity }) => quantity - sold.get(id))
      }]
    }

    const options = {
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{ stacked: true }],
      }
    }

    return (
      <ChartCard title={l`Inventory`} showSettings={showSettings} innerRef={card => ref.current = card}>
        <Bar
          data={data}
          width={ChartCard.width}
          height={ChartCard.height}
          options={options}
          />
        <SecondaryCard anchor={ref} title={l`Options`}>
          Hello world
        </SecondaryCard>
      </ChartCard>
    )
  }
}
