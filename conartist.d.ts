export type ID = number;
export type ProductTypeName = string;

export type Color = number;

export type ProductType = {
  color: Color;
  name: ProductTypeName;
  id: ID;
  discontinued: boolean;
  dirty?: boolean;
};
export type ProductTypes = ProductType[];

export type NewType = {
  kind: 'create';
  color: Color;
  name: ProductTypeName;
};

export type ModifyType = {
  kind: 'modify';
  id: ID;
  color: Color;
  name: ProductTypeName;
  discontinued: boolean;
};

export type TypeUpdate = NewType | ModifyType;
export type TypesUpdate = TypeUpdate[];

export type Product = {
  name: string;
  quantity: number;
  id: ID;
  type: ID;
  discontinued: boolean;
  dirty?: boolean;
};
export type Products = Product[];

export type NewProduct = {
  kind: 'create';
  name: string;
  type: ID;
  quantity: number;
};

export type ModifyProduct = {
  kind: 'modify';
  id: ID;
  name: string;
  quantity: number;
  discontinued: boolean;
};

export type ProductUpdate = NewProduct | ModifyProduct;
export type ProductsUpdate = ProductUpdate[];

export type Record = {
  products: ID[];
  price: number;
  time: number;
  dirty?: boolean;
};
export type Records = Record[];
export type RecordUpdate = {
  products: ID[];
  price: number;
  time: number;
};
export type RecordsUpdate = RecordUpdate[];

export type PriceList = number[][];

export type Price = {
  type: ID;
  product: ID | null,
  prices: PriceList;
  dirty?: boolean;
}
export type Prices = Price[];

export type PriceUpdate = {
  type_id: ID;
  product_id: ID | null;
  price: PriceList;
};
export type PricesUpdate = PriceUpdate[];

export type ConventionData = {
  products: Products;
  records: Records;
  prices: Prices;
  types: ProductTypes;
};

export type MetaConvention = {
  type: 'meta';
  title: string;
  code: string;
  start: Date;
  end: Date;
  dirty?: boolean;
};

export type FullConvention = {
  type: 'full';
  title: string;
  code: string;
  start: Date;
  end: Date;
  data: ConventionData;
  dirty?: boolean;
};

export type InvalidConvention = {
  type: 'invalid';
  code: string;
  dirty?: boolean;
}

export type Convention = MetaConvention | FullConvention | InvalidConvention;
export type Conventions = Convention[];

export type ConventionAdd = {
  type: 'add';
  code: string;
};
export type ConventionRemove = {
  type: 'remove';
  code: string;
};
export type ConventionModify = {
  type: 'modify';
  code: string;
  data: {
    products: ModifyProduct[];
    prices: PricesUpdate;
  }
};

export type ConventionUpdate = ConventionAdd | ConventionRemove | ConventionModify;
export type ConventionsUpdate = ConventionUpdate[];

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
