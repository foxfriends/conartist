/* @flow */
import * as React from 'react'
import { Bar } from 'react-chartjs-2'

import Map from '../../../util/default-map'
import { ChartCard } from './card'
import { NotEnoughData } from './not-enough-data'
import { SecondaryCard } from '../../card-view/secondary-card'
import { Select } from '../../../common/select'
import { l } from '../../../localization'
import { model } from '../../../model'
import type { Product } from '../../../model/product'
import type { Record } from '../../../model/record'
import S from './chart.css'

export type Props = {
  products: Product[],
  records: Record[],
  showSettings: (React.Node) => void,
}

export type State = {
  type: ?number,
}

export class InventoryChart extends React.Component<Props, State> {
  // $FlowIgnore
  ref: React.Ref<HTMLDivElement>
  constructor(props: Props) {
    super(props)
    // $FlowIgnore
    this.ref = { current: null }
    this.state = {
      type: null,
    }
  }

  render() {
    const { productTypes } = model.getValue()
    const { products, records, showSettings } = this.props
    const { type } = this.state

    const selectedProducts = type === null ? products : products.filter(({ typeId }) => typeId === type)

    const types = new Set(products.map(({ typeId }) => typeId))

    const sold = [].concat(...records.map(({ products }) => products))
      .reduce((acc, productId) => acc.set(productId, acc.get(productId) + 1), new Map([], 0))

    const data = {
      labels: selectedProducts.map(({ name }) => name),
      datasets: [{
        label: 'Sold',
        xAxisId: 'sold',
        backgroundColor: '#ff0000',
        data: selectedProducts.map(({ id }) => sold.get(id))
      }, {
        label: 'Remaining',
        xAxisId: 'remaining',
        backgroundColor: '#3E803E',
        data: selectedProducts.map(({ id, quantity }) => quantity - sold.get(id))
      }]
    }

    const options = {
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{ stacked: true }],
      }
    }

    return (
      <ChartCard title={l`Inventory`} showSettings={showSettings} innerRef={card => this.ref.current = card}>
        <>
          <Bar
            data={data}
            width={600}
            height={600}
            options={options}
            />
          { selectedProducts.length === 0
            ? <NotEnoughData />
            : null
          }
        </>
        <SecondaryCard anchor={this.ref} title={l`Options`} onClose={() => showSettings(null)}>
          <div className={S.options}>
            <Select
              title={l`Filter types`}
              options={[null, ...types]}
              defaultValue={type}
              onChange={type => this.setState({ type })}
              className={S.select}
              >
              {typeId => {
                const productType = productTypes.find(({ id }) => id === typeId)
                return productType ? productType.name : <span className={S.any}>{l`Any`}</span>
              }}
            </Select>
          </div>
        </SecondaryCard>
      </ChartCard>
    )
  }
}
