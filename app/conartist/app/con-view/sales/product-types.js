// @flow
'use strict';
import React, { Component } from 'react';
import { Platform, TouchableHighlight, TouchableNativeFeedback, View, FlatList, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { views, text } from '../../styles'
import type { ConventionData } from '../../conartist.types';

// TODO: add types
type Props = {
  navigation: any,
  screenProps: {
    data: ConventionData,
  },
};

export default class ProductTypes extends Component<any, Props, any> {
  static navigationOptions = {
    title: 'Sales',
    tabBarIcon: <Icon name='attach-money' size={24} color='white'/>,
  };

  state = {
    productTypes: this.props.screenProps.data.types,
    selectedType: '',
  };

  componentWillReceiveProps(props: Props) {
    this.setState({ productTypes: props.screenProps.data.types });
  }

  renderListItem(item: ProductType) {
    const contents = (
      <View style={[views.listItem, views.padded, views.paper]}>
        <View style={[views.circle, { backgroundColor: `#${item.color.toString(16).padStart(6, '0')}` }]}>
          <View style={[views.flex, views.vMiddle, views.hMiddle]}>
            <Text style={[text.icon, { color: 'white' }]}>{ item.name[0] }</Text>
          </View>
        </View>
        <Text style={[views.hPadded, text.primary]}>{item.name}</Text>
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
          data={this.state.productTypes.filter(_ => !_.discontinued)}
          keyExtractor={(_, i) => `${i}`}
          renderItem={({item}) => this.renderListItem(item)} />
      </View>
    );
  }
}
