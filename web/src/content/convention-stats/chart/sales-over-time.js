/*       */
import * as React from 'react'
import startOfDay from 'date-fns/startOfDay'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'

import { toLocal } from '../../../util/date'
import Map from '../../../util/default-map'
import { ChartCard } from './card'
import { NotEnoughData } from './not-enough-data'
import { ChartsLoading } from './charts-loading'
import { SecondaryCard } from '../../card-view/secondary-card'
import { Select } from '../../../common/select'
import { l, localize } from '../../../localization'
import { Money } from '../../../model/money'
import { model } from '../../../model'
                                                   
import S from './chart.css'

const Line = React.lazy(() => import(/* webpackChunkName: "chart" */ './lazy/line'))
const { Suspense } = React

                     
                    
                                     
 

              
                            
                                
                   
 

              
             
               
  

const colors = [
  '#8bc2ae',
  '#9c63c6',
  '#dbc0a4',
  '#8293d4',
  '#e4aaa0',
  '#d2a1dd',
  '#9cd0b4',
]

function splitByDays(items        ) {
  if (!items.length) { return [] }

  const days = []
  let day = []
  let currentDay = startOfDay(items[0].time).valueOf()

  for (const item of items) {
    if (startOfDay(item.time).valueOf() === currentDay) {
      day.push(item)
    } else {
      currentDay = startOfDay(item.time).valueOf()
      days.push(day)
      day = [item]
    }
  }

  days.push(day)
  return days
}

function dailyTotals(data        )         {
  if (!data.length) { return [] }
  const startPrice = (data[0] || {}).price || Money.zero
  const startQuantity = (data[0] || {}).quantity || 0
  return data.map(({ time, price, quantity }) => ({ time, price: price.add(startPrice.negate()), quantity: quantity - startQuantity }))
}

function deltas(data        )         {
  return data.map(({ time, price }, i, arr) => ({
    time,
    price: price.add(((arr[i - 1] || {}).price || Money.zero).negate()),
    quantity: 1,
  }))
}

               
               
                
               
 

function averages(grouping         = 1)                       {
  const minutes = Math.max(Math.abs(grouping), 1) * 1000 * 60
  return data => {
    const buckets           = []
    let bucket         = { time: 0, count: 0, total: Money.zero }
    for (const item of data) {
      if (!bucket.time) {
        bucket.time = item.time.getTime() + (minutes / 2)
      }

      const fitsInBucket = Math.abs(item.time.getTime() - bucket.time) <= minutes / 2

      if (fitsInBucket) {
        bucket.count += 1
        bucket.total = bucket.total.add(item.price)
      } else {
        buckets.push(bucket)
        bucket = {
          time: item.time.getTime() + (minutes / 2),
          count: 1,
          total: item.price,
        }
      }
    }

    buckets.push(bucket)

    if (buckets.length) {
      const first = buckets[0].time - minutes
      const last = buckets[buckets.length - 1].time + minutes
      const averaged = buckets.map(({ time, count, total }) => ({
        time: new Date(time),
        price: total.multiply(1 / count),
        quantity: count,
      }))
      return [
        { time: new Date(first), price: Money.zero, quantity: 0 },
        ...averaged,
        { time: new Date(last), price: Money.zero, quantity: 0 },
      ]
    } else {
      return []
    }
  }
}

export class SalesOverTimeChart extends React.Component               {
  // $FlowIgnore
  ref                           

  constructor(props       ) {
    super(props)
    // $FlowIgnore
    this.ref = { current: null }
    this.state = {
      mode: 'Average',
      metric: 'Customers',
      grouping: 30,
    }
  }

  render() {
    const { records, showSettings } = this.props
    const { mode, grouping, metric } = this.state

    const dates = [...new Set(records.map(({ time }) => startOfDay(toLocal(time)).getTime()))]
      .sort()
      .map(time => new Date(time))
    const days = dates.map(date => format(date, l`EEE`))

    const totalOverTime = splitByDays(
      records
        .reduce((acc, { time, price, quantity }) => ([...acc, {
          time: time,
          price: price.add((acc[acc.length - 1] || {}).price || Money.zero),
          quantity: 1 + ((acc[acc.length - 1] || { quantity: 0 }).quantity),
        }]), [])
    )

    let daysData          
    switch (mode) {
      case 'Total':
        daysData = totalOverTime.map(dailyTotals)
        break
      case 'Average':
        daysData = totalOverTime
          .map(dailyTotals)
          .map(deltas)
          .map(averages(grouping))
        break
      default:
        break
    }

    const data = {
      datasets: daysData.map((data, i) => ({
        cubicInterpolationMode: 'monotone',
        fill: false,
        label: days[i],
        borderColor: colors[i % 7],
        data: data.map(({ time, price, quantity }) => ({
          x: time.getTime(),
          y: metric === 'Money' ? price.amount : quantity,
        })),
      })),
    }

    const options = {
      legend: {
        display: true,
      },
      tooltips: {
        callbacks: {
          title: ([{ xLabel }]) => format(new Date(xLabel), l`h:mma`),
          label: ({ yLabel }) => metric === 'Money' ? new Money(model.getValue().settings.currency, yLabel) : yLabel,
        },
      },
      scales: {
        xAxes: [
          {
            type: 'linear',
            position: 'bottom',
            ticks: {
              callback: label => format(label, l`h:mma`),
            },
            scaleLabel: {
              display: true,
              labelString: l`Time`,
            },
          },
        ],
        yAxes: [
          {
            type: 'linear',
            ticks: {
              callback: label => metric === 'Money' ? new Money(model.getValue().settings.currency, label) : label,
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
      <ChartCard title={l`Sales Over Time`} showSettings={showSettings} innerRef={card => this.ref.current = card}>
        <div className={S.container}>
          <Suspense fallback={<ChartsLoading />}>
            <Line
              data={records.length <= 1 ? { datsets: [] } : data}
              width={600}
              height={600}
              options={options}
              />
          </Suspense>
          { records.length <= 1
            ? <NotEnoughData />
            : null
          }
        </div>
        <SecondaryCard anchor={this.ref} title={l`Options`} onClose={() => showSettings(null)}>
          <div className={S.options}>
            <Select
              title={l`Mode`}
              options={['Average', 'Total']}
              defaultValue={mode}
              onChange={mode => this.setState({ mode })}
              >
              {localize}
            </Select>
            <Select
              title={l`Metric`}
              options={['Customers', 'Money']}
              defaultValue={metric}
              onChange={metric => this.setState({ metric })}
              >
              {localize}
            </Select>
            <Select
              title={l`Grouping`}
              options={[5, 10, 15, 30, 60, 120]}
              defaultValue={grouping}
              onChange={grouping => this.setState({ grouping })}
              >
              {minutes => l`${minutes} minutes`}
            </Select>
          </div>
        </SecondaryCard>
      </ChartCard>
    )
  }
}
