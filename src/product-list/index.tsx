'use strict';
import * as React from 'react';
import { AppBar, IconButton, Chip, List, ListItem, TextField, Drawer, FloatingActionButton, Badge } from 'material-ui';
import Save from 'material-ui/svg-icons/content/save';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { PriceMap, ProductTypes } from '../types';

type Props = {
  type: keyof ProductTypes;
  items: string[];
  prices: PriceMap[];
  close: () => void;
  save: (selected: string[], price: number) => void;
};

type State = {
  selected: string[];
  price: string;
  priceError: string;
};

// TODO: figure out SCSS modules? or at least put these somewhere tidy
const container = {
  display: 'flex',
  flexWrap: 'wrap',
} as React.CSSProperties;
const margined = {
  margin: '4px',
} as React.CSSProperties;

export default class ProductList extends React.Component<Props, State> {
  readonly state: State = { selected: [], price: '', priceError: '' };

  private addProduct(product: string): void {
    this.setState({ selected: [ ...this.state.selected, product ]}, () => {
      const price = this.calculatePrice();
      this.setState({ price, priceError: price === '' ? 'Please enter a price' : '' });
    });
  }

  private removeProduct(product: number): void {
    const selected = [...this.state.selected];
    selected.splice(product, 1);
    this.setState({ selected }, () => {
      const price = this.calculatePrice();
      this.setState({ price, priceError: price === '' ? 'Please enter a price' : '' });
    });
  }

  private calculatePrice(): string {
    let remaining = this.state.selected.length;
    const price = (this.props.prices || []).sort(([a], [b]) => b - a)
      .reduce((t, [qty, price]) => {
        while(remaining >= qty) {
          remaining -= qty;
          t += price;
        }
        return t;
      }, 0)
    return price ? price.toString(10) : '';
  }

  private close(): void {
    this.setState({ selected: [], price: '', priceError: '' });
    this.props.close();
  }

  private save(): void {
    if(this.state.priceError === '' && this.state.selected.length > 0) {
      this.props.save(this.state.selected, +this.state.price)
      this.props.close();
      this.setState({ selected: [], price: '', priceError: '' });
    }
  }

  private handleChange(_: React.FormEvent<{}>, price: string) {
    if(/^\d+(\.\d+)?$/.test(price)) {
      this.setState({ price: price, priceError: ''});
    } else {
      this.setState({ price: price, priceError: 'Price is not a number' });
    }
  }

  render() {
    return (
      <div>
        <Drawer
          open={!!this.props.type}
          openSecondary
          disableSwipeToOpen
          width='100%'>
          <AppBar
            title={ProductTypes[this.props.type]}
            iconElementLeft={<IconButton><NavigationClose /></IconButton>}
            onLeftIconButtonTouchTap={() => this.close()} />
          <div style={{ margin: '0 16px' }}>
            <TextField
            value={this.state.price}
            floatingLabelText="Price" onChange={(_, value) => this.handleChange(_, value)}
            errorText={this.state.priceError}
            fullWidth />
          </div>
          <div style={{
            maxHeight: 'calc(100vh - 136px)',
            overflowY: 'auto',
          }}>
            <div style={container}>
              { this.state.selected.map((name, i) =>
                <Chip key={i} onTouchTap={() => this.removeProduct(i)} style={margined}>
                  {name}
                </Chip>
              ) }
            </div>
            <List>
            { this.props.items.map(item =>
              <ListItem key={item} primaryText={item} onClick={() => this.addProduct(item)} />
            ) }
            </List>
          </div>
        </Drawer>
        <Badge
          badgeContent={this.state.selected.length}
          secondary
          badgeStyle={{
            fontFamily: 'Roboto,sans-serif',
            top: 20,
            right: 20,
            zIndex: 1401,
            display: this.state.selected.length ? 'flex' : 'none'
          }}
          style={{
            position: 'fixed',
            bottom: 5,
            right: 0,
            transform: `scale(${this.props.type ? 1 : 0})`,
            zIndex: 1400,
          }}>
          <FloatingActionButton
            onTouchTap={() => this.save()}
            disabled={!!this.state.priceError || this.state.selected.length === 0} >
            <Save />
          </FloatingActionButton>
        </Badge>
      </div>
    );
  }
}
