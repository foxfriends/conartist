'use strict';

import * as React from 'react';
import { List, ListItem, Avatar, RaisedButton } from 'material-ui';
import * as Moment from 'moment';
import { saveAs } from 'file-saver';

import {  ProductTypes, Record, Colors } from '../types';

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
      ).join('\n') + `\nTotal,${total.quantity},--,${total.price},--`
    ])
    saveAs(blob, 'records.csv', true);
  }

  render() {
    return (
      <div>
        <div style={{margin: '4px'}}>
          <RaisedButton label='Export All' primary onTouchTap={() => this.save()} fullWidth />
        </div>
        <List>
          { this.props.records.sort(({time: a}, {time: b}) => b - a).map((record, i) =>
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
    );
  }
}
