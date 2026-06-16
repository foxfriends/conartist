import { Money } from "./money";

export function parse({ discountId, name, typeIds, productIds, flatAmount, percentageAmount }) {
  return {
    discountId,
    name,
    typeIds,
    productIds,
    flatAmount: flatAmount ? Money.fromJSON(flatAmount) : null,
    percentageAmount,
  };
}
