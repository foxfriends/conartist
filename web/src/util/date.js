/* @flow */
import addMinutes from 'date-fns/addMinutes'
import subMinutes from 'date-fns/subMinutes'

export function sameDayAs(date: Date): (Date) => boolean {
  date = date || this
  const day = justDay(date)
  return date2 => {
    const day2 = justDay(date2)
    return day2.getTime() === day.getTime()
  }
}

export function sameUTCDayAs(date: Date): (Date) => boolean {
  date = date || this
  const day = justUTCDay(date)
  return date2 => {
    const day2 = justUTCDay(date2)
    return day2.getTime() === day.getTime()
  }
}

export function justDay(date: Date): Date {
  date = date || this
  const newDate = new Date(date)
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate
}

export function justUTCDay(date: Date): Date {
  date = date || this
  const newDate = new Date(date)
  newDate.setUTCHours(0)
  newDate.setUTCMinutes(0)
  newDate.setUTCSeconds(0)
  newDate.setUTCMilliseconds(0)
  return newDate
}

export function toUTC(date: Date): Date {
  date = date || this
  return subMinutes(date, new Date(date).getTimezoneOffset())
}

export function toLocal(date: Date): Date {
  date = date || this
  return addMinutes(date, new Date(date).getTimezoneOffset())
}
