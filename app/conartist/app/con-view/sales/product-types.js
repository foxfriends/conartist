'use strict';
import React, { Component } from 'react';
import { Platform, TouchableHighlight, TouchableNativeFeedback, View, FlatList, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { views, text } from '../../styles'
import { ProductTypes, Colors } from '../../constants';

export default class ProductTypeList extends Component {
  static navigationOptions = {
    title: 'Sales',
    tabBarIcon: <Icon name='attach-money' size={24} color='white'/>,
  };

  state = {
    productTypes: Object.keys(this.props.screenProps.data.products),
    selectedType: '',
  };

  componentWillReceiveProps(props) {
    this.setState({ productTypes: Object.keys(props.screenProps.data.products) });
  }

  renderListItem(item) {
    const contents = (
      <View style={[views.listItem, views.padded, views.paper]}>
        <View style={[views.circle, { backgroundColor: Colors[item] }]}>
          <View style={[views.flex, views.vMiddle, views.hMiddle]}>
            <Text style={[text.icon, { color: 'white' }]}>{ ProductTypes[item][0] }</Text>
          </View>
        </View>
        <Text style={[views.hPadded, text.primary]}>{ProductTypes[item]}</Text>
      </View>
    );
    const props = {
      onPress: () => this.props.navigation.navigate('ProductList', { type: item })
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

  render() {
    return (
      <View style={[views.flex, views.paper ]}>
        <FlatList
          data={this.state.productTypes}
          keyExtractor={(_, i) => `${i}`}
          renderItem={({item}) => this.renderListItem(item)} />
      </View>
    );
  }
}
