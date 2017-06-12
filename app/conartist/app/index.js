// @flow
'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import * as fs from 'react-native-fs';
import { views, pages, text } from './styles';
import { StackNavigator } from 'react-navigation';
import SignIn from './sign-in';
import ConCode from './con-code';
import ConView from './con-view';
import ProductList from './con-view/sales/product-list';

const SETTINGS_FILE = fs.DocumentDirectoryPath + '/conartist.settings.json';
const OFFLINE_DATA_FILE = fs.DocumentDirectoryPath + '/conartist.offline-data.json';

const Navigator = StackNavigator({
  SignIn: { screen: SignIn },
  ConCode: { screen: ConCode },
  ConView: { screen: ConView },
  ProductList: { screen: ProductList },
});

function host(strings, ...params) {
  function zip(a, b) {
    a = [...a];
    for(let i = b.length - 1; i >= 0; --i) {
      a.splice(2 * i - 1, 0, b[i]);
    }
    return a;
  }
  return 'http://localhost:8080' + zip(strings, params.map(_ => `${_}`)).join('');
}

type Props = {};

export default class App extends Component {
  // TODO: put some of this in the store
  // TODO: put some of this into OAuth2 things
  state = {
    settings: {
      offline: false,
    },
    user: {
      auth: null,
      id: -1,
      name: '',
      pass: '',
    },
    con: {
      title: '',
      code: '',
      data: {
        products: {},
        prices: {},
        records: [],
      },
    },
  };

  constructor(props: Props) {
    super(props);
    this.loadSettings();
  }

  async loadSettings() {
    if(await fs.exists(SETTINGS_FILE)) {
      const settings = JSON.parse(await fs.readFile(SETTINGS_FILE));
      const con = settings.offline
        ? JSON.parse(await fs.readFile(OFFLINE_DATA_FILE))
        : this.state.con;
      this.setState({ settings, con });
    }
  }

  async saveSettings() {
    await Promise.all([
      fs.writeFile(SETTINGS_FILE, JSON.stringify(this.state.settings)),
      fs.writeFile(OFFLINE_DATA_FILE, JSON.stringify(this.state.con)),
    ]);
  }

  updateUser(name: string) {
    this.setState({ user: { ...this.state.user, name }});
  }

  updatePass(pass: string) {
    this.setState({ user: { ...this.state.user, pass }});
  }

  updateCode(code: string) {
    this.setState({ con: { code, title: '', data: { records: [], products: {}, prices: {} }}});
  }

  async signIn() {
    const body = JSON.stringify({ usr: this.state.user.name, psw: this.state.user.pass });
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Content-Length", `${body.length}`);
    const response = JSON.parse(await (await fetch(host `/api/auth`, { method: 'POST', headers, body })).json());
    if(response.status === 'Success') {
      this.setState({ user: { ...this.state.user, ...response.data }});
      return [true];
    } else {
      return [false, response.error];
    }
  }

  async loadCon() {
    const headers = new Headers();
    headers.append("Authorization", this.state.user.auth);
    const { title, products, prices, records } = await JSON.parse(await (await fetch(host`/api/user/${this.state.user.id}/con/${this.state.con.code}/`, { headers })).json());
    this.setState({
      settings: {
        ...this.state.settings,
      },
      con: {
        ...this.state.con,
        title,
        data: {
          products, prices, records,
        },
      },
    });
  }

  savePurchase(type: string, products: string[], price: number) {
    this.setState({
      con: {
        ...this.state.con,
        data: {
          ...this.state.con.data,
          records: [
            ...this.state.con.data.records,
            {
              type,
              products,
              price,
              time: Date.now(),
            },
          ],
        },
      },
    });
  }

  render() {
    return (
      <View style={[ views.flex, views.vMiddle, pages.signIn ]}>
        <Navigator screenProps={{
          updateUser: user => this.updateUser(user),
          updatePass: pass => this.updatePass(pass),
          updateCode: code => this.updateCode(code),
          signIn: () => this.signIn(),
          loadCon: () => this.loadCon(),
          savePurchase: (type, products, price) => this.savePurchase(type, products, price),
          data: this.state.con.data,
          ...this.state.settings,
        }}/>
      </View>
    );
  }
}
