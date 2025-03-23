/*       */

import { parse as parseMetaConvention } from "./meta-convention";
import { parse as parseProduct } from "./product";
import { parse as parseProductType } from "./product-type";
import { parse as parsePrice } from "./price";
import { parse as parseRecord } from "./record";
import { parse as parseExpense } from "./expense";

export function parse({
  products,
  productTypes,
  prices,
  records,
  expenses,
  ...meta
}) {
  // $FlowIgnore: Not good at spread with exact types
  return {
    ...parseMetaConvention(meta),
    products: products.map(parseProduct),
    productTypes: productTypes.map(parseProductType),
    prices: prices.map(parsePrice),
    records: records.map(parseRecord),
    expenses: expenses.map(parseExpense),
  };
}
