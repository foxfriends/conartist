import { Money } from "./money";

export function parse({ id, uuid, products, discounts, price, time, info }) {
  return {
    name: "record",
    id,
    uuid,
    products,
    discounts,
    price: Money.fromJSON(price),
    time: new Date(time),
    info,
  };
}
