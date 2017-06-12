// @flow
'use strict';
export type ProductType = string;

export type Color = [number, number, number];
export type Colors = { [ProductType]: Color, };

export type Product = [string, number];
export type Products = { [ProductType]: Product[]};

export type Record = {
  type: ProductType,
  products: string[],
  price: number,
  time: number,
};
export type Records = Record[];

export type Price = [number, number][];
export type Prices = { [ProductType]: Price };

export type ConventionData = {
  products: Products,
  records: Records,
  prices: Prices,
  colors: Colors,
};

export type Convention = {
  title: string,
  code: string,
  start: Date,
  end: Date,
  data: ConventionData,
};

export type APISuccessResult<T> = {
  status: 'Success',
  data: T,
};
export type APIErrorResult = {
  status: 'Error',
  error: string,
};
export type APIResult<T> = APISuccessResult<T> | APIErrorResult;
