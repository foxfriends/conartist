'use strict';
import * as React from 'react';
import { AppBar, Card, CardHeader, CardMedia, CardActions, RaisedButton } from 'material-ui';

import { ConData, Products, ProductTypes } from '../../types';
import { get } from '../../request';
import InventoryChart from './inventory-chart';
import ConList from './con-list';

import './dashboard.scss';

type Props = {};
type State = {
  products: Products;
  cons: ConData;
};

export default class Dashboard extends React.Component<Props, State> {
  state: State = { products: {} as Products, cons: { keys: 0, cons: [] } };

  constructor(props: Props) {
    super(props);
    this.load();
  }

  private load(): void {
    get('/dashboard/products').then (products => this.setState({ products:  JSON.parse(products)  as Products }));
    get('/dashboard/cons').then     (cons     => this.setState({ cons:      JSON.parse(cons)      as ConData  }));
  }

  private manageInventory(): void {
    // TODO: manage the inventory
  }

  private showBuy(): void {
    // TODO: show and allow purchasing
  }

  get products(): Products {
    // TODO: cache this or something. could get slow for bigger product lists
    const order = Object.keys(ProductTypes);
    const products: Products = {};
    const old = this.state.products;
    // deep copy the products list...
    Object.keys(old).sort((a, b) => order.indexOf(a) - order.indexOf(b)).forEach(
      (key: keyof ProductTypes) => {
        if(old[key]!.length > 0) {
          products[key] = old[key]!.map<[string, number]>(([a,b]) => [a,b]);
        }
      }
    );
    return products;
  }

  render() {
    return (
      <div>
        <AppBar />
        <div className='dashboard'>
          <Card className='dashboard__card'>
            <CardHeader title='Inventory' />
            <CardMedia>
              <div className='dashboard__chart'>
                <InventoryChart products={this.products} />
              </div>
            </CardMedia>
            <CardActions>
              <RaisedButton label='Manage inventory' primary onTouchTap={() => this.manageInventory()} />
            </CardActions>
          </Card>
          <Card className='dashboard__card'>
            <CardHeader title='Conventions' />
            <CardMedia>
              <ConList cons={this.state.cons} />
            </CardMedia>
            <CardActions>
              <RaisedButton label='Get more conventions' primary onTouchTap={() => this.showBuy()} />
            </CardActions>
          </Card>
        </div>
      </div>
    );
  }
}
