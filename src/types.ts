'use strict';
import { blue400, blue200, red300, orange400, orange200, green300 } from 'material-ui/styles/colors';

export const ProductTypes = {
  Print11x17: '11x17 Print',
  Print5x7: '5x7 Print',
  Sticker: 'Sticker',
  HoloSticker: 'Holo sticker',
  Button: 'Button',
  Other: 'Other',
};
export type ProductTypes = typeof ProductTypes;

export type Products = {
  [key in keyof ProductTypes]: [string, number][];
};

export type Record = {
  type: keyof ProductTypes,
  quantity: number;
  products: string[],
  price: number;
  time: number;
};

export type PriceMap = [number, number];

export type Prices = {
  [key in keyof ProductTypes]: PriceMap[];
};

export type SalesData = {
  products: Products;
  prices: Prices;
  records: Record[];
}

export type Metric = 'Customers' | 'Items Sold' | 'Money';

export const Colors: { [key in keyof ProductTypes]: string } = {
  Print11x17: blue400,
  Print5x7: blue200,
  Button: red300,
  Sticker: orange400,
  HoloSticker: orange200,
  Other: green300,
};
export type Colors = typeof Colors;
