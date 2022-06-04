/* @flow */
import * as React from 'react'

import Map from '../../../util/default-map'
import { ChartCard } from './card'
import { NotEnoughData } from './not-enough-data'
import { ChartsLoading } from './charts-loading'
import { SecondaryCard } from '../../card-view/secondary-card'
import { Select } from '../../../common/select'
import { Checkbox } from '../../../common/checkbox'
import { l } from '../../../localization'
import type { ProductType } from '../../../model/product-type'
import type { Product } from '../../../model/product'
import type { Record } from '../../../model/record'
import S from './chart.css'

const Bar = React.lazy(() => import(/* webpackChunkName: "chart" */ './lazy/bar'))
const { Suspense } = React

export type Props = {
  productTypes: ProductType[],
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
      onlySold: true,
    }
  }

  render() {
    const { productTypes, products, records, showSettings } = this.props
    const { type, onlySold } = this.state

    const sold = records
      .flatMap(({ products }) => products)
      .reduce((acc, productId) => acc.set(productId, acc.get(productId) + 1), new Map([], 0))

    let selectedProducts = products;
    if (type !== null) {
      selectedProducts = selectedProducts.filter(({ typeId }) => typeId === type)
    }
    if (onlySold) {
      selectedProducts = selectedProducts.filter(({ id }) => (sold.get(id) || 0) > 0)
    }

    const types = new Set(products.map(({ typeId }) => typeId))

    const data = {
      labels: selectedProducts.map(({ name }) => name),
      datasets: [{
        label: l`Sold`,
        xAxisId: 'sold',
        backgroundColor: '#b52b2b',
        data: selectedProducts.map(({ id }) => sold.get(id))
      }, {
        label: l`Remaining`,
        xAxisId: 'remaining',
        backgroundColor: '#3E803E',
        data: selectedProducts.map(({ id, quantity }) => Math.max(0, quantity - sold.get(id)))
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
          <Suspense fallback={<ChartsLoading />}>
            <Bar
              data={data}
              width={600}
              height={600}
              options={options}
              />
          </Suspense>
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
              >
              {typeId => {
                const productType = productTypes.find(({ id }) => id === typeId)
                return productType ? productType.name : <span className={S.any}>{l`Any`}</span>
              }}
            </Select>

            <div className="">
              <Checkbox
                defaultValue={onlySold}
                value={onlySold}
                onChange={(onlySold) => this.setState({ onlySold })}
              >
                {l`Show sold products only`}
              </Checkbox>
            </div>
          </div>
        </SecondaryCard>
      </ChartCard>
    )
  }
}
