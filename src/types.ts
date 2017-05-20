'use strict';

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
