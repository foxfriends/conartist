/* @flow */

export function sameDayAs(date: Date): (Date) => boolean {
  const day = justDay(date)
  return date2 => {
    const day2 = justDay(date2)
    return day2.getTime() === day.getTime()
  }
}

export function justDay(date: Date): Date {
  const newDate = new Date(date)
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate
}
