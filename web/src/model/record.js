/*       */

import { Money } from "./money";

export function parse({ id, uuid, products, price, time, info }) {
  return {
    name: "record",
    id,
    uuid,
    products,
    price: Money.fromJSON(price),
    time: new Date(time),
    info,
  };
}
