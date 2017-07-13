// @flow
'use strict';
import React, { Component } from 'react';
import { Platform, TextInput, TouchableHighlight, TouchableNativeFeedback, View, FlatList, Text, Button, ScrollView } from 'react-native';
import FloatingActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { views, text } from '../../styles'
import Chip from './chip';
import type { Product } from '../../conartist.types';

export default class ProductList extends Component {
  static navigationOptions = ({ navigation: { state: { params: { type }}}}) => ({ title: type.name })
  state = {
    selected: [],
    price: 0,
    rawPrice: '',
  };

  renderListItem(item: Product) {
    const contents = (
      <View style={[views.listItem, views.paper]}>
        <Text style={[views.hPadded, text.primary]}>{item.name}</Text>
      </View>
    );
    const props = {
      onPress: () => this.addItem(item)
    };
    if(Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback { ...props }>
          { contents }
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableHighlight { ...props } style={[views.flex]}>
          { contents }
        </TouchableHighlight>
      );
    }
  }

  savePurchase() {
    this.props.screenProps.savePurchase(this.state.selected.map(_ => _.id), this.state.price)
    this.props.navigation.goBack();
  }

  addItem(item: Product) {
    this.setState({
      selected: [ ...this.state.selected, item ],
    }, () => {
      const price = this.calculatePrice();
      this.setState({
        price, rawPrice: `${price}`
      })
    });
  }

  removeItem(index: number) {
    const selected = [...this.state.selected];
    selected.splice(index, 1);
    this.setState({
      selected
    }, () => {
      const price = this.calculatePrice();
      this.setState({
        price, rawPrice: `${price}`
      })
    });
  }

  calculatePrice() {
    const selected = [...this.state.selected];
    const { type } = this.props.navigation.state.params;
    const { data } = this.props.screenProps;
    console.log(data);
    const counts = { [type.id]: 0 };
    selected.reverse().forEach(product => {
      const fullname = `${type.id}::${product.id}`;
      const found = data.prices.find(_ => _.type === type.id && _.product === product.id);
      if(found) {
        counts[fullname] = (counts[fullname] || 0) + 1;
      } else {
        counts[type.id]++;
      }
    });
    const price = Object.keys(counts)
      .reduce((_, key) => {
        const [type, product] = key.split('::').map(_ => isNaN(+_) ? null : +_);
        console.log(type, product, data.prices.find(_ => _.type === type && _.product === product), data.prices);
        const price = data.prices.find(_ => _.type === type && _.product === product);
        const cost = (price ? price.prices : [])
          .sort(([a], [b]) => b - a)
          .reduce((t, [qty, pr]) => {
            while(counts[key] >= qty) {
              counts[key] -= qty;
              t += pr;
            }
            return t;
          }, 0)
        return _ + cost;
      }, 0);
    return price;
  }

  updatePrice(rawPrice: string) {
    const price = parseFloat(rawPrice);
    this.setState({ rawPrice, price: price || 0 });
  }

  render() {
    const saveActive = !!(this.state.price.toString() === this.state.rawPrice && this.state.selected.length);
    return (
      <View style={[views.flex, views.paper]}>
        <View style={{ height: 48, alignSelf: 'stretch', flexDirection: 'row' }}>
          <TextInput
            keyboardType='numeric'
            value={this.state.rawPrice}
            onChangeText={text => this.updatePrice(text)}
            placeholder={'Price'}
            style={views.flex}/>
        </View>
        <View style={{ height: 32, alignSelf: 'stretch', flexDirection: 'row' }}>
          <ScrollView horizontal={true} style={views.flex} showsHorizontalScrollIndicator={false}>
            { this.state.selected.length
              ? this.state.selected.map((item, i) => <Chip text={item.name} onPress={() => this.removeItem(i)} key={i} />)
              : <Text style={[views.hPadded, text.secondary]}>No items selected</Text>}
          </ScrollView>
        </View>
        <FlatList
          data={this.props.screenProps.data.products.filter(_ => _.type === this.props.navigation.state.params.type.id)}
          keyExtractor={(_, i) => `${i}`}
          renderItem={({item}) => this.renderListItem(item)} />
        <FloatingActionButton
          onPress={() => saveActive && this.savePurchase()}
          buttonColor={saveActive ? '#0099cc' : '#bbbbbb'}
          icon={<Icon name='save' color={saveActive ? 'white' : '#eeeeee'} size={28} />}
          useNativeFeedback={saveActive}
          activeOpacity={saveActive ? 0.85 : 1} />
      </View>
    );
  }
}
