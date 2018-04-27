/* @flow */
import * as React from 'react'
import moment from 'moment'

import { forkJoin } from 'rxjs/observable/forkJoin'
import { of } from 'rxjs/observable/of'
import { switchMap, tap, map, filter } from 'rxjs/operators'

import { CreateConvention } from '../../api/create-convention'
import { AddConventionInfo } from '../../api/add-convention-info'
import { batchResponses } from '../../api/util'

import { BasicCard } from '../card-view/basic-card'
import { Button } from '../../common/button'
import { Input } from '../../common/input'
import { Textarea } from '../../common/textarea'
import * as toast from '../../toast'
import type { Validation as InputValidation } from '../../common/input'
import S from './index.css'
const { Fragment } = React

export type Props = {}
type State = {
  name: string,
  startDate: ?Date,
  endDate: ?Date,
  address: string,
  hours: [?Date, ?Date][],
  website: string,
  websiteURL: string,
  image: string, // TODO: image uploads here
}

export class NewConvention extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      name: '',
      startDate: null,
      endDate: null,
      address: '',
      hours: [],
      website: '',
      websiteURL: '',
      image: '',
    }
  }

  handleStartChange(dateStr: string) {
    const startDate = new Date(dateStr)
    const { endDate } = this.state
    const hours = []
    if (endDate) {
      for (const date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        hours.push([new Date(), new Date()])
      }
    }
    this.setState({
      startDate,
      hours,
    })
  }

  handleEndChange(dateStr: string) {
    const endDate = new Date(dateStr)
    const { startDate } = this.state
    const hours = []
    if (startDate) {
      for (const date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        hours.push([null, null])
      }
    }
    this.setState({
      endDate,
      hours,
    })
  }

  handleTimeChange(index: number, which: 'open' | 'close', time: string) {
    const [hour, minute] = time.split(':')
    const { startDate } = this.state
    if (!startDate) {
      return
    }
    const date = new Date(startDate)
    date.setHours(startDate.getUTCHours() + parseInt(hour, 10))
    date.setMinutes(startDate.getUTCMinutes() + parseInt(minute, 10))
    date.setDate(startDate.getUTCDate() + index)

    const { hours: [...hours] } = this.state
    hours[index][which === 'open' ? 0 : 1] = date

    this.setState({ hours })
  }

  saveConvention() {
    const { startDate, endDate, hours, name, address, website, websiteURL } = this.state
    if (!endDate || !startDate) {
      alert('Dates are not set')
      return
    }
    if (endDate < startDate) {
      alert('End date is before start date')
      return
    }
    const day = new Date(startDate)
    for (const [start, end] of hours) {
      if (!end || !start) {
        alert('Hours are not set')
        return
      }
      if (end < start) {
        alert('Start hours are before end hours')
        return
      }
      if (start < day && end < day) {
        alert('Hours are for the wrong day (down)')
        return
      }
      day.setDate(day.getDate() + 1)
      if (start > day && end > day) {
        alert('Hours are for the wrong day (up)')
        return
      }
    }
    if (name === '') {
      alert('Name is missing')
      return
    }
    if (address === '') {
      alert('Address is missing')
      return
    }
    if (website === '' || websiteURL === '') {
      alert('Website is missing')
      return
    }

    new CreateConvention()
      .send({ title: name, startDate: moment(startDate).format(), endDate: moment(endDate).format() })
      .pipe(
        tap(response => response.state === 'failed' ? alert(response.error) : void 0),
        filter(response => response.state === 'retrieved'),
        switchMap(({ value: conId }) =>
          forkJoin([
            new AddConventionInfo().send({ conId, title: 'Address', info: JSON.stringify(address), action: 'TODO: coordinates', actionText: null }),
            new AddConventionInfo().send({ conId, title: 'Hours', info: JSON.stringify(hours), action: null, actionText: null }),
            new AddConventionInfo().send({ conId, title: 'Website', info: null, action: websiteURL, actionText: website }),
          ])
        ),
        map(batchResponses),
        tap(() => toast.send(<span>Convention created</span>)),
      )
      .subscribe()
  }

  render() {
    const { startDate, endDate } = this.state

    const hoursForm = [];
    if (startDate && endDate) {
      const start = startDate.getDate()
      const end = endDate.getDate()
      for (const date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const index = hoursForm.length
        hoursForm.push(
          <Fragment key={date.toString()}>
            <Input className={S.halfInput} title='Start' type='time' onChange={time => this.handleTimeChange(index, 'open', time)}/>
            <Input className={S.halfInput} title='End' type='time' onChange={time => this.handleTimeChange(index, 'close', time)}/>
          </Fragment>
        )
      }
    }

    return (
      <BasicCard title='Add a convention' collapsible={true}>
        <div className={S.form}>
          <Input title='Name' onChange={name => this.setState({ name })}/>
          <Input className={S.halfInput} title='Start date' type='date' onChange={startDate => this.handleStartChange(startDate)}/>
          <Input className={S.halfInput} title='End date' type='date' onChange={endDate => this.handleEndChange(endDate)}/>
          <p>Address</p>
          <Textarea onChange={address => this.setState({ address })} />
          <p>Hours</p>
          { hoursForm }
          <p>Website</p>
          <Input className={S.halfInput} title='Website text' onChange={website => this.setState({ website })}/>
          <Input className={S.halfInput} title='URL' onChange={websiteURL => this.setState({ websiteURL })}/>
          <p>Image (not yet supported)</p>
          <Button title='Save' className={S.button} action={() => this.saveConvention()} />
        </div>
      </BasicCard>
    )
  }
}
