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

export default class App extends Component {
  constructor(props) {
    super(props);
    // TODO: put some of this in the store
    // TODO: put some of this into OAuth2 things
    this.state = {
      settings: {
        offline: false,
        title: '',
        code: '',
        user: '',
        pass: '',
      },
      data: {
        products: {},
        prices: {},
        records: [],
      },
    };
    this.loadSettings();
  }

  async loadSettings() {
    if(await fs.exists(SETTINGS_FILE)) {
      const settings = JSON.parse(await fs.readFile(SETTINGS_FILE));
      const data = settings.offline
        ? JSON.parse(await fs.readFile(OFFLINE_DATA_FILE))
        : this.state.data;
      this.setState({ settings, data });
    }
  }

  saveSettings() {
    fs.writeFile(SETTINGS_FILE, JSON.stringify(this.state.settings));
    if(this.state.settings.offline) {
      fs.writeFile(OFFLINE_DATA_FILE, JSON.stringify(this.state.data));
    } else {
      fs.unlink(OFFLINE_DATA_FILE);
    }
  }

  updateUser(user) {
    this.setState({ settings: { ...this.state.settings, user }});
  }

  updatePass(pass) {
    this.setState({ settings: { ...this.state.settings, pass }});
  }

  updateCode(code) {
    this.setState({ settings: { ...this.state.settings, code }});
  }

  async signIn() { }

  async loadCon() {
    this.setState({
      settings: {
        ...this.state.settings,
        title: 'Anime North 2017'
      },
      data: {
        records: [],
        products: {
          Print11x17: [[ 'abc', 3 ], [ 'def', 6 ], [ 'ghi', 9 ]],
          Print5x7: [[ 'jkl', 3 ], [ 'mno', 6 ], [ 'pqr', 9 ]],
        },
        prices: {
          Print11x17: [[ 1, 15 ], [ 2, 25 ], [ 3, 30 ]]
        }
      }
    });
  }

  savePurchase(type, products, price) {
    this.setState({
      data: {
        ...this.state.data,
        records: [
          ...this.state.data.records,
          {
            type,
            products,
            price,
            time: Date.now(),
          }
        ]
      }
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
          data: this.state.data,
          ...this.state.settings,
        }}/>
      </View>
    );
  }
}
