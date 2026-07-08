import { parse as parseImage } from "./convention-image";
import { parse as parseExtraInfo } from "./convention-extra-info";
import { parse as parseUserInfo } from "./convention-user-info";
import { parse as parseMetaConvention } from "./meta-convention";
import { parse as parseProduct } from "./product";
import { parse as parseProductType } from "./product-type";
import { parse as parsePrice } from "./price";
import { parse as parseRecord } from "./record";
import { parse as parseExpense } from "./expense";

export function parse({
  images,
  extraInfo,
  userInfo,
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
    images: images.map(parseImage),
    extraInfo: extraInfo.map(parseExtraInfo),
    userInfo: userInfo.map(parseUserInfo),
    products: products.map(parseProduct),
    productTypes: productTypes.map(parseProductType),
    prices: prices.map(parsePrice),
    records: records.map(parseRecord),
    expenses: expenses.map(parseExpense),
  };
}
