import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Colors from '../../styles/Colors';
import {FontSizes} from '../../styles/FontSizes';

const window = Dimensions.get('window');

const ModalContainer = ({name, children}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.modalHeaderTitle}>{name}</Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: window.width,
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 20,
  },
  modalHeaderTitle: {
    fontSize: FontSizes.fontSize24,
    fontWeight: '700',
    color: Colors.colorDarkGray,
  },
});

export default ModalContainer;
