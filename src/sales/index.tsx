'use strict';

import * as React from 'react';
import { List, ListItem, AppBar, Tabs, Tab, Avatar, Snackbar } from 'material-ui';
import { grey500 as priceColor } from 'material-ui/styles/colors';
import { createStore, Store } from 'redux';
import * as numeral from 'numeral';

import ProductList from '../product-list';
import RecordList from '../record-list';
import Stats from '../stats';
import { get, put } from '../request';
import { reducer, Purchase, Init, ActionTypes } from './reducer';
import {  ProductTypes, Products, SalesData, Prices, PriceMap, Record, Colors } from '../types';

type Props = {};
type State = {
  productType: keyof ProductTypes | null;
  products: [string, number][];
  prices: PriceMap[];
  tabIndex: number;
  saved: boolean;
};

export default class Sales extends React.Component<Props, State> {
  readonly state: State = {
    productType: null,
    products: [],
    prices: [],
    tabIndex: 0,
    saved: false,
  };
  store: Store<Readonly<SalesData>>;

  constructor(props: Props) {
    super(props);
    this.store = createStore<SalesData>(reducer);
    this.store.dispatch({ type: ActionTypes.Init, products: {} as Products, prices: {} as Prices, records: [] } as Init);
    this.getProducts().then(data => this.store.dispatch({ type: ActionTypes.Init, ...data } as Init));
    this.store.subscribe(() => this.forceUpdate());
  }

  private async getProducts(): Promise<{ products: Products, prices: Prices, records: Record[] }> {
    return JSON.parse(await get('/products'));
  }

  private toProducts(productType: keyof ProductTypes | null): void {
    this.setState({
      productType,
      products: productType ? this.products[productType] : [],
      prices: productType ? this.store.getState().prices[productType] : [],
    });
  }

  private get products(): Products {
    // TODO: cache this or something. could get slow for bigger product lists
    const products = { ...this.store.getState().products };
    // deep copy the products list...
    Object.keys(products).forEach((key: keyof ProductTypes) => products[key] = products[key].map<[string, number]>(([a,b]) => [a,b]));
    this.store.getState().records.forEach(
      ({ type, products: _ }) => _.forEach(
        product => products[type as keyof ProductTypes].find(([_]) => _ === product)![1]--
      )
    );
    return products;
  }

  private async savePurchase(products: string[], price: number): Promise<void> {
    const record: Record = {
      type: this.state.productType!,
      quantity: products.length,
      products,
      price,
      time: Date.now()
    };
    this.store.dispatch({ type: ActionTypes.Purchase, record } as Purchase);
    await put('/purchase', record);
    this.setState({ saved: true });
  }

  private handleChange(tabIndex: number) {
    this.setState({ tabIndex });
  }

  private closeSnackbar(): void {
    this.setState({ saved: false });
  }

  render() {
    return (
      <div>
        <AppBar
          title='Anime North 2017'
          iconStyleLeft={{ display: 'none' }} />
        <Tabs
          value={this.state.tabIndex}
          onChange={(value: number) => this.handleChange(value)}>
          <Tab label='Sell' value={0}>
            <div style={{
              maxHeight: 'calc(100vh - 112px)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}>
              <List>
                { Object.keys(ProductTypes).map((type: keyof ProductTypes) =>
                  (this.store.getState().products[type] || []).length === 0 ? null :
                  <ListItem
                    key={type}
                    primaryText={
                      <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
                        {ProductTypes[type]}
                        <span style={{ margin: '0 4px', color: priceColor, display: 'flex', flexDirection: 'column'}}>
                          { (this.store.getState().prices[type] || [])
                              .sort(([a], [b]) => a - b)
                              .map(([q, p]) => <span key={q}>{q}: {numeral(p).format('$0,0.00')}</span>)
                          }
                        </span>
                      </div>
                    }
                    onClick={() => this.toProducts(type)}
                    leftAvatar={
                      <Avatar backgroundColor={Colors[type]} style={{top: 'calc(50% - 20px)'}}>{ProductTypes[type][0]}</Avatar>
                    } />
                )}
              </List>
            </div>
          </Tab>
          <Tab label='History' value={1}>
            <div style={{
              maxHeight: 'calc(100vh - 112px)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}>
              <RecordList records={this.store.getState().records} />
            </div>
          </Tab>
          <Tab label='Stats' value={2}>
            <div style={{
              maxHeight: 'calc(100vh - 112px)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}>
              <Stats data={this.store.getState()} />
            </div>
          </Tab>
        </Tabs>
        <ProductList
          type={this.state.productType!}
          items={this.state.products}
          prices={this.state.prices}
          close={() => this.toProducts(null)}
          save={(purchase, price) => this.savePurchase(purchase, price)} />
        <Snackbar
          open={this.state.saved}
          message='Saved!'
          autoHideDuration={3000}
          onRequestClose={() => this.closeSnackbar()} />
      </div>
    );
  }
}
