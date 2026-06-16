import { model } from "../model";

export function setDiscounts(discounts) {
  model.next({
    ...model.getValue(),
    discounts,
  });
}
