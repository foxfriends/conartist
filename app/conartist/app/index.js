'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import * as fs from 'react-native-fs';
import { views, pages, text } from './styles';
import SignIn from './sign-in';
import ConCode from './con-code';
import ConView from './con-view';

const SETTINGS_FILE = fs.DocumentDirectoryPath + '/conartist.settings.json';
const OFFLINE_DATA_FILE = fs.DocumentDirectoryPath + '/conartist.offline-data.json';

const SIGNIN = 'signin', CONCODE = 'concode', CONVIEW = 'conview';

export default class App extends Component {
  constructor(props) {
    super(props);
    // TODO: put some of this in the store
    // TODO: put some of this into OAuth2 things
    this.state = {
      page: SIGNIN,
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

  async signIn() {
    this.setState({ page: CONCODE });
  }

  async loadCon() {
    this.setState({ page: CONVIEW, title: 'Anime North 2017' });
  }

  render() {
    return (
      <View style={[ views.flex, views.vMiddle, pages.signIn ]}>
        { this.state.page === SIGNIN ?
          <SignIn
            updateUser={pass => this.updatePass(pass)}
            updatePass={pass => this.updatePass(pass)}
            onSubmit={() => this.signIn()} />
          : null }
        { this.state.page === CONCODE ?
          <ConCode
            updateCode={pass => this.updateCode(pass)}
            onSubmit={() => this.loadCon()} />
          : null }
        { this.state.page === CONVIEW ?
          <ConView />
          : null }
      </View>
    );
  }
}
