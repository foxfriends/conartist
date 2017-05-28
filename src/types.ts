'use strict';
import { blue400, blue200, orange400, orange200, green300, red300, grey400 } from 'material-ui/styles/colors';

export const ProductTypes = {
  Print11x17: '11x17 Print',
  Print5x7: '5x7 Print',
  Sticker: 'Sticker',
  HoloSticker: 'Holo sticker',
  Button: 'Button',
  Charm: 'Charm',
  Other: 'Other',
};
export type ProductTypes = typeof ProductTypes;

export type AllProducts = {
  [key: string]: [string, number][];
};
export type Products = Partial<AllProducts>;

export type Record = {
  type: keyof ProductTypes;
  quantity: number;
  products: string[];
  price: number;
  time: number;
};

export type PriceMap = [number, number];

export type Prices = {
  [key: string]: PriceMap[];
};

export type SalesData = {
  products: AllProducts;
  prices: Prices;
  records: Record[];
};

export type ConData = {
  title: string;
};

export type Metric = 'Customers' | 'Items Sold' | 'Money';

export const Colors: { [key in keyof ProductTypes]: string } = {
  Print11x17: blue400,
  Print5x7: blue200,
  Button: green300,
  Charm: red300,
  Sticker: orange400,
  HoloSticker: orange200,
  Other: grey400,
};
export type Colors = typeof Colors;

export function empty<T>(val: T, keyset: (keyof ProductTypes)[] = Object.keys(ProductTypes) as (keyof ProductTypes)[]): { [key in keyof ProductTypes]: T } {
  function cp(v: any): any {
    if(v instanceof Array) { return [...v]; }
    else if(typeof v === 'object') { return {...v} as T; }
    else { return v; }
  }
  return keyset.reduce(
    (_: { [key in keyof ProductTypes]: T }, key: keyof ProductTypes) => ({ ..._, [key]: cp(val) }), {} as { [key in keyof ProductTypes]: T }
  );
}
