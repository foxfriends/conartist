// @flow
'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import * as fs from 'react-native-fs';
import { views, pages, text } from './styles';
import { StackNavigator } from 'react-navigation';
import Splash from './splash';
import SignIn from './sign-in';
import ConCode from './con-code';
import ConView from './con-view';
import ProductList from './con-view/sales/product-list';

const SAVE_STATE_FILE = fs.DocumentDirectoryPath + '/conartist.state.json';

const Navigator = StackNavigator({
  Splash: { screen: Splash },
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
  return 'http://192.168.122.1:8080' + zip(strings, params.map(_ => `${_}`)).join('');
}

type Props = {};

export default class App extends Component {
  // TODO: put some of this in the store
  // TODO: put some of this into OAuth2 things
  state = {
    authtoken: null,
    settings: { offlineMode: false },
    user: {
      name: '',
      pass: '',
    },
    con: null,
  };

  constructor(props: Props) {
    super(props);
    this.loadSettings();
  }

  async loadSettings() {
    // this function might just be one big hack
    if(await fs.exists(SAVE_STATE_FILE)) {
      const state = JSON.parse(await fs.readFile(SAVE_STATE_FILE));
      await new Promise(resolve => this.setState(state, () => resolve()));
      if(this.state.authtoken) {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${this.state.authtoken}`);
        try {
          const response = await (await fetch(host`/api/auth/`, { method: 'GET', headers })).json();
          if(response.status === 'Success') {
            this.setState({ authtoken: response.data });
            if(this.state.settings.offlineMode && this.state.con) {
              return ['SignIn', 'ConCode', 'ConView'];
            } else {
              this.setState({ settings: { offlineMode: false }, con: null});
              return ['SignIn', 'ConCode'];
            }
          } else {
            throw new Error('Invalid auth token');
          }
        } catch(error) {
          this.setState({ authtoken: null, con: null, settings: { offlineMode: false } });
        }
      }
    }
    return ['SignIn'];
  }

  setState(state, cb = () => this.saveSettings()) {
    super.setState(state, cb);
  }

  saveInProgress = null;
  onSaveEnd = () => {};
  saveSettings() {
    if(this.saveInProgress === null) {
      this.saveInProgress = fs.writeFile(SAVE_STATE_FILE, JSON.stringify(this.state));
      this.saveInProgress.then(() => {
        this.saveInProgress = null;
        this.onSaveEnd();
        this.onSaveEnd = () => {};
      });
    } else {
      this.onSaveEnd = () => this.saveSettings();
    }
  }

  updateUser(name: string) {
    this.setState({ user: { ...this.state.user, name }});
  }

  updatePass(pass: string) {
    this.setState({ user: { ...this.state.user, pass }});
  }

  updateCode(code: string) {
    this.setState({ con: { code }});
  }

  toggleOfflineMode() {
    this.setState({ settings: { offlineMode: !this.state.settings.offlineMode } });
  }

  async signIn() {
    try {
      const body = JSON.stringify({ usr: this.state.user.name, psw: this.state.user.pass });
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Content-Length", `${body.length}`);
      const response = await (await fetch(host`/api/auth/`, { method: 'POST', headers, body })).json();
      if(response.status === 'Success') {
        this.setState({ authtoken: response.data, user: { name: '', pass: '' } });
        return [true];
      } else {
        return [false, response.error];
      }
    } catch(error) {
      console.warn(error);
    }
  }

  async loadCon() {
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${this.state.authtoken}`);
      const response = await (await fetch(host`/api/con/${this.state.con.code}/true`, { headers })).json();
      if(response.status === 'Success') {
        this.setState({ con: response.data });
      } else {
        throw new Error('Data was not retrieved successfully');
      }
    } catch(error) {
      console.warn(error);
      throw new Error('You are not signed up for that convention');
    }
  }

  savePurchase(products: number[], price: number) {
    this.setState({
      con: {
        ...this.state.con,
        data: {
          ...this.state.con.data,
          records: [
            ...this.state.con.data.records,
            {
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
          savePurchase: (products, price) => this.savePurchase(products, price),
          loadSettings: () => this.loadSettings(),
          data: this.state.con && this.state.con.data,
          ...this.state.settings,
        }}/>
      </View>
    );
  }
}
