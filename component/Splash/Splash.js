import React from 'react';
import {View, Image, Text} from 'react-native';
import icon from '../../resources/icon.png';

const Splash = () => {
  return (
    <View style={styles.wrapper}>
      <Image style={styles.icon} source={icon} />
      <View style={styles.dummyView} />
    </View>
  );
};
const styles = {
  wrapper: {
    height: '100%',
    backgroundColor: '#212229',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 128,
    height: 128,
    resizeMode: 'contain',
  },
  dummyView: {
    height: 16,
  },
};

export default Splash;
