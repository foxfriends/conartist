'use strict';

import * as React from 'react';
import { List, ListItem, AppBar, Tabs, Tab, Avatar, Snackbar } from 'material-ui';
import { blue400, blue200, red300, orange400, orange200, green300 } from 'material-ui/styles/colors';
import { createStore, Store } from 'redux';
// import SwipeableViews from 'react-swipeable-views';
import * as Moment from 'moment';

import ProductList from '../product-list';
import Stats from '../stats';
import { get, put } from '../request';
import { reducer, Purchase, Init, ActionTypes } from './reducer';
import {  ProductTypes, Products, SalesData, Prices, PriceMap, Record } from '../types';

const Colors: { [key in keyof ProductTypes]: string } = {
  Print11x17: blue400,
  Print5x7: blue200,
  Button: red300,
  Sticker: orange400,
  HoloSticker: orange200,
  Other: green300,
};

type Props = {};
type State = {
  productType: keyof ProductTypes | null;
  products: string[];
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
  }

  private async getProducts(): Promise<{ products: Products, prices: Prices, records: Record[] }> {
    return JSON.parse(await get('/products'));
  }

  private toProducts(productType: keyof ProductTypes | null): void {
    this.setState({
      productType,
      products: productType ? this.store.getState().products[productType].map(_ => _[0]) : [],
      prices: productType ? this.store.getState().prices[productType] : [],
    });
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
                  <ListItem
                    key={type}
                    primaryText={ProductTypes[type]}
                    onClick={() => this.toProducts(type)}
                    leftAvatar={
                      <Avatar backgroundColor={Colors[type]}>{ProductTypes[type][0]}</Avatar>
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
              <List>
                { this.store.getState().records.sort(({time: a}, {time: b}) => b - a).map((record, i) =>
                  <ListItem
                    key={i}
                    primaryText={record.products.join(', ')}
                    secondaryText={
                      <p>
                        {Moment(record.time).format('h:mm a')} &mdash; {'$' + record.price}
                      </p>
                    }
                    leftAvatar={<Avatar backgroundColor={Colors[record.type]}>{ProductTypes[record.type][0]}</Avatar>} />
                )}
              </List>
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
        {
        // <SwipeableViews
        //   index={this.state.tabIndex}
        //   onChangeIndex={(value: number) => this.handleChange(value)}>
        //
        //
        //
        // </SwipeableViews>
        }
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
