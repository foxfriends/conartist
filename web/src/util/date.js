/*       */
import addMinutes from "date-fns/addMinutes";
import subMinutes from "date-fns/subMinutes";
import parseISO from "date-fns/parseISO";
import isValid from "date-fns/isValid";

export function sameDayAs(date) {
  date = date || this;
  const day = justDay(date);
  return (date2) => {
    const day2 = justDay(date2);
    return day2.getTime() === day.getTime();
  };
}

export function sameUTCDayAs(date) {
  date = date || this;
  const day = justUTCDay(date);
  return (date2) => {
    const day2 = justUTCDay(date2);
    return day2.getTime() === day.getTime();
  };
}

export function justDay(date) {
  date = date || this;
  const newDate = new Date(date);
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

export function justUTCDay(date) {
  date = date || this;
  const newDate = new Date(date);
  newDate.setUTCHours(0);
  newDate.setUTCMinutes(0);
  newDate.setUTCSeconds(0);
  newDate.setUTCMilliseconds(0);
  return newDate;
}

export function toUTC(date) {
  date = date || this;
  return subMinutes(date, new Date(date).getTimezoneOffset());
}

export function toLocal(date) {
  date = date || this;
  return addMinutes(date, new Date(date).getTimezoneOffset());
}

export function dateRecovery(_, dateString) {
  if (typeof dateString === "string") {
    const parsedDate = parseISO(dateString);
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  return dateString;
}
