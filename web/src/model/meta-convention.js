import { Money } from "./money";

export function parse({
  id,
  name,
  start,
  end,
  recordTotal,
  expenseTotal,
}) {
  return {
    id,
    name,
    start: new Date(start),
    end: new Date(end),
    recordTotal: recordTotal && Money.fromJSON(recordTotal),
    expenseTotal: expenseTotal && Money.fromJSON(expenseTotal),
  };
}
