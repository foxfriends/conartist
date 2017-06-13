declare namespace ca {
  export type Color = [number, number, number];

  export type ProductTypes = {
    [key: string]: {
      color: Color;
      name: string;
      id: number
    };
  };
  export type ProductType = keyof ProductTypes;

  export type Product = {
    name: string;
    quantity: number;
    id: number;
  };
  export type Products = { [key in ProductType]: Product[]; };

  export type ProductUpdate = {
    id: number;
    name?: string;
    quantity?: number;
  };
  export type ProductsUpdate = ProductUpdate[];

  export type Record = {
    type: ProductType;
    products: string[];
    price: number;
    time: number;
  };
  export type Records = Record[];
  export type RecordUpdate = {
    products: number[];
    price: number;
    time: number;
  };
  export type RecordsUpdate = RecordUpdate[];

  export type Price = [number, number][];
  export type Prices = { [key: string]: Price };
  export type PriceUpdate = {
    type_id: number;
    product_id: number | null;
    price: Price;
  };

  export type PricesUpdate = PriceUpdate[];

  export type ConventionData = {
    products: Products;
    records: Records;
    prices: Prices;
    types: ProductTypes;
  };

  export type Convention = {
    title: string;
    code: string;
    start: Date;
    end: Date;
    data: ConventionData;
  };

  export type APISuccessResult<T> = {
    status: 'Success';
    data: T;
  };
  export type APIErrorResult = {
    status: 'Error';
    error: string;
  };
  export type APIResult<T> = APISuccessResult<T> | APIErrorResult;
}
export default ca;
