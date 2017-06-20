export type Color = [number, number, number] | number[];

export type ProductTypes = {
  [key: string]: {
    color: Color;
    name: string;
    id: number
  };
};
export type ProductType = keyof ProductTypes;

export type NewType = {
  kind: 'create';
  color: Color;
  name: string;
};

export type ModifyType = {
  kind: 'modify';
  id: number;
  color?: Color;
  name?: string;
};

export type TypeUpdate = NewType | ModifyType;
export type TypesUpdate = TypeUpdate[];

export type Product = {
  name: string;
  quantity: number;
  id: number;
  type: ProductType;
};
export type Products = { [key in ProductType]: Product[]; };

export type NewProduct = {
  kind: 'create';
  name: string;
  type: number;
  quantity: number;
};

export type ModifyProduct = {
  kind: 'modify';
  id: number;
  type?: number;
  name?: string;
  quantity?: number;
};

export type ProductUpdate = NewProduct | ModifyProduct;
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

export type Price = [number, number][] | number[][];
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

export type MetaConvention = {
  title: string;
  code: string;
  start: Date;
  end: Date;
};

export type FullConvention = {
  title: string;
  code: string;
  start: Date;
  end: Date;
  data: ConventionData;
};

export type Convention = MetaConvention | FullConvention;
export type Conventions = Convention[];

export type APISuccessResult<T> = {
  status: 'Success';
  data: T;
};
export type APIErrorResult = {
  status: 'Error';
  error: string;
};
export type APIResult<T> = APISuccessResult<T> | APIErrorResult;

export type UserInfo = {
  email: string;
  keys: number;
  products: Products;
  prices: Prices;
  types: ProductTypes;
  conventions: Conventions;
};
