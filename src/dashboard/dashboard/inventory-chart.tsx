'use strict';
import * as React from 'react';
import { SelectField, MenuItem, IconButton, AppBar, RaisedButton } from 'material-ui';
import Settings from 'material-ui/svg-icons/action/settings';
import Close from 'material-ui/svg-icons/navigation/close';
import BarChart from '../../chart/bar-chart';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { Products, ProductTypes } from '../../types';
import Sidenav from '../../sidenav';

type Props = {
  products: Products;
};
type State = {
  type: keyof ProductTypes | null;
  settings: boolean;
};

export default class SalesPerType extends React.Component<Props, State> {
  state: State = {
    type: null,
    settings: false,
  };

  componentWillReceiveProps(props: Props): void {
     if(this.state.type === null) {
       this.setState({ type: Object.keys(props.products)[0] as keyof ProductTypes });
     }
  }

  private get bars(): { [key: string]: number } {
    return this.state.type ? this.barsForType(this.state.type) : {};
  }

  private barsForType(type: keyof ProductTypes): { [key: string]: number } {
    return this.props.products[type]!.reduce((_, [name, qty]) => ({ ..._, [name]: qty }), {} as { [key: string]: number });
  }

  private typeChange(_: __MaterialUI.TouchTapEvent, __: number, type: keyof ProductTypes): void {
    this.setState({ type });
  }

  private async save(): Promise<void> {
    const zip = new JSZip();
    Object.keys(this.props.products).map<[string, string]>((type: keyof ProductTypes) => {
      const products = this.props.products[type]!;
      return [`${type}.csv`, products.map(_ => _.join(',')).join('\n')];
    }).forEach(([name, content]) => zip.file(name, content));
    saveAs(await zip.generateAsync({type: 'blob'}), 'inventory.zip');
  }

  render() {
    return (
      <div style={{ position: 'relative'}}>
        <IconButton
          style={{ position: 'absolute', top: 0, right: 10 }}
          onTouchTap={() => this.setState({ settings: true })}>
          <Settings />
        </IconButton>
        <BarChart yLabel='Quantity' bars={this.bars} />
        <Sidenav
          open={this.state.settings}
          openSecondary
          width={400}
          onBackdropClick={() => this.setState({ settings: false })}>
          <AppBar
            title='Inventory Settings'
            iconElementLeft={<IconButton><Close /></IconButton>}
            onLeftIconButtonTouchTap={() => this.setState({ settings: false })} />
          <div style={{padding: 16}}>
            <SelectField
              floatingLabelText='Product Type'
              value={this.state.type}
              onChange={(event, index, value: keyof ProductTypes) => this.typeChange(event, index, value)}>
              { Object.keys(this.props.products).map((type: keyof ProductTypes, i) =>
                <MenuItem key={i} value={type} primaryText={ProductTypes[type]} />
              ) }
            </SelectField>
          </div>
          <div style={{padding: 16}}>
            <RaisedButton label='Export All' primary onTouchTap={() => this.save()}/>
          </div>
        </Sidenav>
      </div>
    );
  }
}
