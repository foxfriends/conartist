'use strict';

import * as React from 'react';
import { List, ListItem, Avatar, RaisedButton } from 'material-ui';
import * as Moment from 'moment';
import { saveAs } from 'file-saver';
import * as numeral from 'numeral';

import {  ProductTypes, Record, Colors } from '../../types';

type Props = {
  records: Record[];
};
type State = {};

export default class RecordList extends React.Component<Props, State> {
  private save(): void {
    const total = { quantity: 0, price: 0 };
    const blob = new Blob([
      'Type,Quantity,Products,Price,Time\n' +
      this.props.records.map(
        ({ type, quantity, products, price, time }) => `${type},${total.quantity += quantity, quantity},${products.join(';')},${total.price += price, price},${time}`
      ).join('\n') + `\nTotal,${total.quantity},--,${total.price},--`,
    ]);
    saveAs(blob, 'records.csv', true);
  }

  render() {
    return (
      <div>
        <div style={{margin: '4px'}}>
          <RaisedButton label='Export All' primary onTouchTap={() => this.save()} fullWidth />
        </div>
        <List>
          { this.props.records.sort(({time: a}, {time: b}) => b - a).map((record, i) => {
              const products = record.products
                .reduce((o: { [key: string]: number }, p: keyof typeof o) => (o[p] = o[p] ? o[p] + 1 : 1, o), {} as { [key: string]: number });
              const productStr = Object.keys(products).map((key: keyof typeof products) =>
                products[key] === 1 ? key : `${key} (${products[key]})`).join(', ');
              return (
                <ListItem
                  key={i}
                  primaryText={productStr}
                  secondaryText={
                    <p>
                      {Moment(record.time).format('MMM D, h:mm a')} &mdash; {numeral(record.price).format('$0,0.00')}
                    </p>
                  }
                  leftAvatar={<Avatar backgroundColor={Colors[record.type]}>{ProductTypes[record.type][0]}</Avatar>} />
              );
            }) }
        </List>
      </div>
    );
  }
}
