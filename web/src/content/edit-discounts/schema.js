import { VALID } from "../../model/validation";

export const DuplicateName = Symbol();
export const NonNumberAmount = Symbol();
export const NonPositiveAmount = Symbol();

let currentDiscountId = 1;
export function discountId() {
  return `discount_id${currentDiscountId++}`;
}

export function editableDiscount(discount) {
  return {
    ...discount,
    original: discount,
    discountId: discountId(),
    nameValidation: { state: VALID },
    amountValidation: { state: VALID },
  };
}

export function nonEditableDiscount(discount) {
  if (!discount.flatAmount && !discount.percentageAmount) {
    throw new Error("A discount must have a flat amount or percentage amount");
  }
  if (discount.flatAmount && discount.percentageAmount) {
    throw new Error(
      "A discount may not have both a flat amount and percentage amount",
    );
  }
  return {
    name: discount.name,
    productTypeIds: discount.productTypeIds,
    productIds: discount.productIds,
    flatAmount: discount.flatAmount,
    percentageAmount: discount.percentageAmount,
  };
}

export function hasher({ name }) {
  return `${name}`;
}
