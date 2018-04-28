/* @flow */

export function sameDayAs(date: Date): (Date) => boolean {
  const newDate = new Date(date)
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)

  return date => {
    const copy = new Date(date)
    copy.setHours(0)
    copy.setMinutes(0)
    copy.setSeconds(0)
    copy.setMilliseconds(0)
    return copy.getTime() === newDate.getTime()
  }
}
