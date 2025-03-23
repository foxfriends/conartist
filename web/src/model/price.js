/*       */

import { Money } from "./money";

export function parse({ typeId, productId, quantity, price }) {
  return {
    typeId,
    productId,
    quantity,
    price: Money.fromJSON(price),
  };
}
