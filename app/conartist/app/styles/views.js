import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  vMiddle: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  padded: {
    padding: 16,
  },
  hPadded: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  margined: {
    margin: 16,
  },
  paper: {
    backgroundColor: 'white',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
  },
  listItemBacking: {
    backgroundColor: 'black',
  },
});
