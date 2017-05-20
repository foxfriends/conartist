'use strict';

import { Action, Reducer } from 'redux';
import { Record, Prices, SalesData, Products } from '../types';

export enum ActionTypes {
  Init, Purchase
}

export interface Purchase extends Action {
  type: ActionTypes.Purchase;
  record: Record;
}
export interface Init extends Action {
  type: ActionTypes.Init;
  products: Products;
  prices: Prices;
  records: Record[];
}

type InventoryAction = Init | Purchase;

export const reducer: Reducer<Readonly<SalesData>> = function reducer(state: Readonly<SalesData>, action: InventoryAction): SalesData {
  switch(action.type) {
    case ActionTypes.Init:
      return {
        products: action.products,
        prices: action.prices,
        records: action.records,
      };
    case ActionTypes.Purchase:
      const updated = { ...state };
      updated.records.push(action.record);
      return updated;
  }
  return { ...state };
};

export default reducer;
