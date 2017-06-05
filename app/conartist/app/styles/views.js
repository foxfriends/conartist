import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  vMiddle: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  hMiddle: {
    alignItems: 'center',
  },
  padded: {
    padding: 16,
  },
  hPadded: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  vPadded: {
    paddingTop: 16,
    paddingBottom: 16,
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
  circle: {
    borderRadius: 100,
    width: 36,
    height: 36,
  },
  chip: {
    margin: 4,
    padding: 4,
    paddingLeft: 8,
    height: 24,
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  chipClose: {
    borderRadius: 12,
    height: 16,
    width: 16,
    marginLeft: 4,
    backgroundColor: '#0000003D',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
