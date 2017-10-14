declare namespace db {
  export type User = {
    user_id: number;
    email: string;
    password: string;
    join_date: number;
    keys: number;
  };
  export type Users = User[];

  export type Convention = {
    con_id: number;
    code: string;
    title: string;
    start_date: number;
    end_date: number;
  };
  export type Conventions = Convention[];

  export type UserConvention = {
    user_con_id: number;
    user_id: number;
    con_id: number;
  };
  export type UserConventions = UserConvention[];

  export type Product = {
    product_id: number;
    user_id: number;
    type_id: number;
    name: string;
    discontinued: boolean;
  };
  export type Products = Product[];

  export type ProductType = {
    type_id: number;
    user_id: number;
    name: string;
    color: number;
    discontinued: boolean;
  };
  export type ProductTypes = ProductType[];

  export type InventoryItem = {
    inv_id: number;
    user_id: number | null;
    user_con_id: number | null;
    product_id: number;
    quantity: number;
  };
  export type Inventory = InventoryItem[];

  export type Price = {
    price_id: number;
    user_id: number | null;
    user_con_id: number | null;
    type_id: number;
    product_id: number | null;
    prices: [number, number][];
  };
  export type Prices = Price[];

  export type Record = {
    record_id: number;
    user_con_id: number;
    price: number;
    products: number[];
    sale_time: number;
  };
  export type Records = Record[];

  export type Expense = {
    expense_id: number;
    user_con_id: number;
    price: number;
    category: string;
    description: string;
    spend_time: number;
  };
  export type Expenses = Expense[];
}
