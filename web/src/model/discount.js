import { Money } from "./money";

export function parse({
  discountId,
  name,
  productTypeIds,
  productIds,
  flatAmount,
  percentageAmount,
}) {
  return {
    discountId,
    name,
    productTypeIds,
    productIds,
    flatAmount: flatAmount ? Money.fromJSON(flatAmount) : null,
    percentageAmount,
  };
}
