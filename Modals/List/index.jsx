import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';

import Colors from '../../styles/Colors';
import {FontSizes} from '../../styles/FontSizes';
import ModalContainer from '../ModalContainer';

const AssetsListComponent = ({modal: {closeModal, params}}) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(params?.list);
  }, [params?.countryList]);

  const handleSelectItem = useCallback(
    item => {
      params?.select?.(item);
      closeModal();
    },
    [closeModal, params],
  );

  const renderItems = useCallback(
    array => {
      return array.map(item => {
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleSelectItem(item)}
            style={styles.renderItem}>
            <View style={styles.icon}>
              <Image source={item.src} style={styles.iconImage} />
            </View>

            <View style={styles.column}>
              <Text style={styles.country}>{item.country}</Text>
              <Text style={styles.currency}>
                {item.currencyFull} • {item.currency}
              </Text>
            </View>
          </TouchableOpacity>
        );
      });
    },
    [handleSelectItem, , params?.list],
  );

  return (
    <View style={styles.container}>
      <ModalContainer name={'Sending to'} closeModal={closeModal}>
        <Text style={styles.listTitle}>All countries</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {renderItems(list)}
        </ScrollView>
      </ModalContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    backgroundColor: Colors.colorLight300,
    marginRight: 16,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  currency: {
    fontSize: FontSizes.fontSizeBase,
    fontWeight: '400',
    color: Colors.colorLight700,
    marginBottom: 4,
  },
  country: {
    fontSize: FontSizes.fontSizeBase,
    fontWeight: '700',
    color: Colors.colorBlack,
  },
  listTitle: {
    fontSize: FontSizes.fontSize16,
    fontWeight: '700',
    color: Colors.colorBlack,
    marginHorizontal: 16,
  },
  iconImage: {
    width: 32,
    height: 24,
    alignSelf: 'center',
    top: 12,
  },
  renderItem: {
    display: 'flex',
    height: 72,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: Colors.colorLight300,
    borderBottomWidth: 2,
  },
});

export default AssetsListComponent;
