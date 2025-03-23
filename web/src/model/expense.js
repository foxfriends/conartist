/*       */

import { Money } from "./money";

export function parse({ id, uuid, category, description, price, time }) {
  return {
    name: "expense",
    id,
    uuid,
    category,
    description,
    price: Money.fromJSON(price),
    time: new Date(time),
  };
}
