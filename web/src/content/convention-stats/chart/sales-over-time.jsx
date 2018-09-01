/* @flow */
import * as React from 'react'
import { Line } from 'react-chartjs-2'
import moment from 'moment';

import Map from '../../../util/default-map'
import { ChartCard } from './card'
import { NotEnoughData } from './not-enough-data'
import { SecondaryCard } from '../../card-view/secondary-card'
import { Select } from '../../../common/select'
import { l, localize } from '../../../localization'
import { Money } from '../../../model/money'
import { model } from '../../../model'
import type { Record } from '../../../model/record'
import S from './chart.css'

export type Props = {
  records: Record[],
  showSettings: (React.Node) => void,
}

type State = {
  mode: 'Average' | 'Total',
  grouping: number,
}

const colors = [
  '#8bc2ae',
  '#9c63c6',
  '#dbc0a4',
  '#8293d4',
  '#e4aaa0',
  '#d2a1dd',
  '#9cd0b4',
]

function splitByDays(items) {
  const days = []
  let day = []
  let currentDay = moment(items[0].time).startOf('day').valueOf()

  for (const item of items) {
    if (moment(item.time).startOf('day').valueOf() === currentDay) {
      day.push(item)
    } else {
      days.push(day)
      day = [item]
    }
  }

  days.push(day)
  return days
}

function dailyTotals(data) {
  const startAmount = data[0].price || Money.zero
  return data.map(({ time, price }) => ({ time, price: price.add(startAmount.negate()) }))
}

function deltas(data) {
  return data.map(({ time, price }, i, arr) => ({
    time,
    price: price.add(((arr[i - 1] || {}).price || Money.zero).negate()),
  }))
}

function averages(grouping = 1) {
  const minutes = Math.max(Math.abs(grouping), 1) * 1000 * 60
  return data => {
    const buckets = []
    let bucket = { count: 0, total: Money.zero }
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

    const last = buckets[buckets.length - 1].time + minutes / 2

    const averaged = buckets.map(({ time, count, total }) => ({ time: new Date(time), price: total.multiply(1 / count) }))
    return [...averaged, { time: new Date(last), price: Money.zero }]
  }
}

function timeInDay(time) {
  return moment(time).valueOf() - moment(time).startOf('day').valueOf()
}

export class SalesOverTimeChart extends React.Component<Props, State> {
  // $FlowIgnore
  ref: React.Ref<HTMLDivElement>

  constructor(props: Props) {
    super(props)
    // $FlowIgnore
    this.ref = { current: null }
    this.state = {
      mode: 'Average',
      grouping: 15,
    }
  }

  render() {
    const { records, showSettings } = this.props
    const { mode, grouping } = this.state

    if (records.length <= 1) {
      return <NotEnoughData />
    }

    const dates = [...new Set(
      records
        .map(({ time }) => time)
        .map(time => moment(time).startOf('day').valueOf())
    )].sort()

    const days = dates
      .map(date => moment(date).format(l`EEE`))

    const totalOverTime = splitByDays(
      records
        .reduce((acc, { time, price }) => ([...acc, { time, price: price.add((acc[acc.length - 1] || {}).price || Money.zero) }]), [])
    )

    let daysData
    switch (mode) {
      case 'Total':
        daysData = totalOverTime.map(dailyTotals)
        break
      case 'Average':
        daysData = totalOverTime.map(dailyTotals).map(deltas).map(averages(grouping))
        break
    }

    const data = {
      datasets: daysData.map((data, i) => ({
        cubicInterpolationMode: 'monotone',
        fill: false,
        label: days[i],
        borderColor: days.map((_, i) => colors[i % 7]),
        data: data.map(({ time, price }) => ({
          x: timeInDay(time),
          y: price.amount,
        })),
      })),
    }

    const options = {
      legend: {
        display: true,
      },
      tooltips: {
        callbacks: {
          title: ([{ xLabel }]) => moment(xLabel).format(l`h:mma`),
          label: ({ yLabel }) => new Money(model.getValue().settings.currency, yLabel),
        },
      },
      scales: {
        xAxes: [
          {
            type: 'linear',
            position: 'bottom',
            ticks: {
              callback: label => moment(label).format(l`h:mma`),
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
              callback: label => new Money(model.getValue().settings.currency, label),
            },
            scaleLabel: {
              display: true,
              labelString: localize(mode),
            },
          },
        ],
      },
    }

    return (
      <ChartCard title={l`Sales Over Time`} showSettings={showSettings} innerRef={card => this.ref.current = card}>
        <>
          <Line
            data={data}
            width={600}
            height={600}
            options={options}
            />
          { records.length <= 1
            ? <NotEnoughData />
            : null
          }
        </>
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
              title={l`Grouping`}
              options={[5, 10, 15, 30, 60]}
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
