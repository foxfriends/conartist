'use strict';
import * as React from 'react';
import { AppBar, IconButton, Chip, List, ListItem, TextField, Drawer, FloatingActionButton, Badge, AutoComplete } from 'material-ui';
import Save from 'material-ui/svg-icons/content/save';
import Close from 'material-ui/svg-icons/navigation/close';
import Back from 'material-ui/svg-icons/navigation/arrow-back';
import { grey500 as qtyColor } from 'material-ui/styles/colors';
import Search from 'material-ui/svg-icons/action/search';
import { PriceMap, ProductTypes } from '../types';

type Props = {
  type: keyof ProductTypes;
  items: [string, number][];
  prices: PriceMap[];
  close: () => void;
  save: (selected: string[], price: number) => void;
};

type State = {
  selected: string[];
  price: string;
  priceError: string;
  searchField: JSX.Element | null;
  searchValue: string | null;
};

export default class ProductList extends React.Component<Props, State> {
  readonly state: State = { selected: [], price: '', priceError: '', searchField: null, searchValue: null };

  private get items(): [string, number][] {
    return this.props.items.filter(([item]) => {
      if(!this.state.searchValue) { return true; }
      return AutoComplete.fuzzyFilter(this.state.searchValue, item);
    });
  }

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
      this.setState({ price, priceError: price === '' && selected.length ? 'Please enter a price' : '' });
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
    if(this.state.searchField) {
      this.toggleSearch();
    } else {
      this.doClose();
    }
  }

  private save(): void {
    if(this.state.priceError === '' && this.state.selected.length > 0) {
      this.props.save(this.state.selected, +this.state.price)
      this.doClose();
    }
  }

  private doClose(): void {
    this.props.close();
    this.setState({ selected: [], price: '', priceError: '', searchValue: null, searchField: null });
  }

  private handleChange(_: React.FormEvent<{}>, price: string) {
    if(/^\d+(\.\d+)?$/.test(price)) {
      this.setState({ price: price, priceError: ''});
    } else {
      this.setState({ price: price, priceError: 'Price is not a number' });
    }
  }

  private updateFilter(searchValue: string): void {
    this.setState({ searchValue });
  }

  private toggleSearch(): void {
    if(this.state.searchField) {
      this.setState({ searchField: null, searchValue: null });
    } else {
      this.setState({
        searchField: <TextField
          onChange={((_, text) => this.updateFilter(text))}
          fullWidth
          inputStyle={{color: 'white'}}
          autoFocus
          hintText='Filter' />,
        searchValue: ''
      });
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
            title={this.state.searchField || ProductTypes[this.props.type]}
            iconElementLeft={<IconButton>
              { this.state.searchField ? <Back /> : <Close /> }
            </IconButton>}
            onLeftIconButtonTouchTap={() => this.close()}
            iconElementRight={this.state.searchField ? undefined : <IconButton><Search /></IconButton>}
            onRightIconButtonTouchTap={() => this.toggleSearch()}
            onTitleTouchTap={() => this.state.searchField || this.toggleSearch()}/>
          <div style={{ margin: '0 16px' }}>
            <TextField
              value={this.state.price}
              floatingLabelText='Price'
              onChange={(_, value) => this.handleChange(_, value)}
              errorText={this.state.priceError}
              disabled={!this.state.selected.length}
              fullWidth />
          </div>
          <div style={{
            maxHeight: 'calc(100vh - 136px)',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              { this.state.selected.map((name, i) =>
                <Chip key={i} onTouchTap={() => this.removeProduct(i)} style={{ margin: '4px' }}>
                  {name}
                </Chip>
              ) }
            </div>
            <List>
            { this.items.map((item): JSX.Element => {
                const qty = Math.max(0, item[1] - this.state.selected.reduce((_, name) => _ + (name === item[0] ? 1 : 0), 0));
                return (
                  <ListItem
                    key={item[0]}
                    primaryText={item[0]}
                    onTouchTap={() => this.addProduct(item[0])}
                    rightIcon={<div style={{ display: 'flex', alignItems: 'center', color: qtyColor}}>{qty}</div>} />
                )
              }
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
