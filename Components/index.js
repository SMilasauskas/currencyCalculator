/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useModal} from 'react-native-modalfy';
import {useNetInfo} from '@react-native-community/netinfo';
import Colors from '../styles/Colors';
import {FontSizes} from '../styles/FontSizes';

import useDebounce from '../hooks/useDebounce';
import {RateServices} from '../services/rateServices';

const countryList = [
  {
    id: 1,
    country: 'Poland',
    currency: 'PLN',
    currencyFull: 'Polish Zloty',
    limit: 20000,
    src: require('../assets/flags/Poland.png'),
  },
  {
    id: 2,
    country: 'Germany',
    currency: 'EUR',
    currencyFull: 'Euro',
    limit: 5000,
    src: require('../assets/flags/Germany.png'),
  },
  {
    id: 3,
    country: 'Britain',
    currency: 'GBP',
    currencyFull: 'British Pound',
    limit: 1000,
    src: require('../assets/flags/Britain.png'),
  },
  {
    id: 4,
    country: 'Ukraine',
    currency: 'UAH',
    currencyFull: 'Hrivna',
    limit: 50000,
    src: require('../assets/flags/Ukraine.png'),
  },
];

const Calculator = () => {
  const {openModal} = useModal();
  const netInfo = useNetInfo();

  const [assetFrom, setAssetFrom] = useState(
    countryList.find(asset => asset.currency === 'PLN'),
  );
  const [assetTo, setAssetTo] = useState(
    countryList.find(asset => asset.currency === 'UAH'),
  );
  const [amountFrom, setAmountFrom] = useState(300);
  const [amountTo, setAmountTo] = useState(null);
  const [rate, setRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const debouncedAmountFrom = useDebounce(amountFrom, 500);

  const loadTrade = useCallback(() => {
    if (assetFrom && assetTo && amountFrom > 0) {
      setIsLoading(true);
      const data = {
        assetFrom: assetFrom.currency,
        assetTo: assetTo.currency,
        amountFrom,
      };

      RateServices.getRate(data)
        .then(response => {
          setAmountTo(response.toAmount.toString());
          setRate(response.rate);
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          console.log(error);
        });
    }
  }, [debouncedAmountFrom, assetFrom, assetTo]);

  const setAmountFromWithCheckMax = useCallback(
    value => {
      if (value > assetFrom.limit) {
        setIsInvalid(true);
      } else {
        setIsInvalid(false);
      }
      setAmountFrom(value);
    },
    [assetFrom],
  );

  const handleOnChangeAmountFrom = value => {
    setAmountFromWithCheckMax(value);
    if (!value) {
      setAmountTo('0');
    }
  };

  const handleOnChangeAmountTo = amount => {
    if (amount > 0) {
      setAmountTo(amount);
      setAmountFrom(amountTo * (1 / rate));
    }
  };

  const handleReverse = () => {
    if (assetFrom && assetTo) {
      const assetFromTemp = assetFrom;
      const amountFromTemp = amountFrom;
      setAmountFrom(amountTo);
      setAmountTo(amountFromTemp);
      setAssetFrom(assetTo);
      setAssetTo(assetFromTemp);
    }
  };

  const handleOpenListForAssetFrom = () => {
    let list = countryList;
    if (assetTo) {
      list = list.filter(asset => {
        return asset.currency !== assetFrom.currency;
      });
    }

    openModal('AssetsListComponent', {
      select: asset => {
        setAssetFrom(asset);
      },
      list,
    });
  };

  const handleOpenListForAssetTo = () => {
    let list = countryList;
    if (assetFrom) {
      list = list.filter(asset => {
        return asset.currency !== assetTo.currency;
      });
    }

    openModal('AssetsListComponent', {
      select: asset => {
        setAssetTo(asset);
      },
      list,
    });
  };

  useEffect(() => {
    loadTrade();
  }, [loadTrade]);

  return (
    <SafeAreaView>
      <View
        style={
          !netInfo.isConnected
            ? [styles.container, {opacity: 0.4}]
            : styles.container
        }>
        <View
          style={
            isInvalid
              ? [
                  styles.content,
                  {
                    borderWidth: 2,
                    borderColor: Colors.colorRedBorder,
                  },
                ]
              : styles.content
          }>
          <View style={styles.column}>
            <Text style={styles.title}>Sending from</Text>
            <TouchableOpacity
              onPress={handleOpenListForAssetFrom}
              disabled={!netInfo.isConnected}
              style={styles.selectButton}>
              <View style={styles.selectedItem}>
                <View style={styles.selectedItemImg}>
                  {assetFrom?.src && (
                    <Image
                      style={styles.selectButtonIcon}
                      source={assetFrom.src}
                    />
                  )}
                  <Text style={styles.currencyTitle}>
                    {assetFrom?.currency}
                  </Text>
                </View>
                <Image
                  style={styles.selectIconArrow}
                  source={require('../assets/chevron-down.png')}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.amount}>
            <TextInput
              editable={netInfo.isConnected}
              keyboardType="numeric"
              style={
                isInvalid
                  ? [styles.input, {color: Colors.colorRedErr}]
                  : styles.input
              }
              onChangeText={handleOnChangeAmountFrom}
              value={amountFrom.toString()}
              returnKeyType="done"
            />
          </View>
        </View>
        <View style={styles.reverseBtnWrapper}>
          <TouchableOpacity
            disabled={isLoading || !netInfo.isConnected}
            onPress={handleReverse}
            style={styles.blueWrapper}>
            <ImageBackground
              style={styles.icon}
              source={require('../assets/reverse-button.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rateWrapper}>
          {assetFrom && assetTo ? (
            <Text style={styles.rate}>
              1 {assetFrom.currency} ~ {rate} {assetTo.currency}
            </Text>
          ) : (
            <Text style={styles.rate}>---</Text>
          )}
        </View>
        <View style={styles.contentBottom}>
          <View style={styles.column}>
            <Text style={styles.title}>Receiver gets</Text>
            <TouchableOpacity
              onPress={handleOpenListForAssetTo}
              disabled={!netInfo.isConnected}
              style={styles.selectButton}>
              <View style={styles.selectedItem}>
                <View style={styles.selectedItemImg}>
                  {assetTo?.src && (
                    <Image
                      style={styles.selectButtonIcon}
                      source={assetTo.src}
                    />
                  )}
                  <Text style={styles.currencyTitle}>{assetTo?.currency}</Text>
                </View>
                <Image
                  style={styles.selectIconArrow}
                  source={require('../assets/chevron-down.png')}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.amount}>
            <TextInput
              keyboardType={'numeric'}
              style={styles.inputBottom}
              //   onChangeText={handleOnChangeAmountTo}
              value={amountTo?.toString()}
              returnKeyType="done"
            />
          </View>
        </View>
      </View>
      {isInvalid && (
        <View style={styles.invalidWrapper}>
          <Image
            style={styles.selectIconArrow}
            source={require('../assets/alert-circle.png')}
          />

          <Text style={styles.invalidText}>
            Maximum sending amount {assetFrom.limit} {assetFrom.currency}
          </Text>
        </View>
      )}
      {!netInfo.isConnected && (
        <View style={styles.invalidWrapper}>
          <Image
            style={styles.selectIconArrow}
            source={require('../assets/alert-circle.png')}
          />

          <Text style={styles.invalidText}>No internet connection</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 184,
    marginTop: '15%',
    marginHorizontal: 20,
    backgroundColor: Colors.colorLight300,
    borderRadius: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 92,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: Colors.colorWhite,
    shadowColor: Colors.colorBoxShadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  contentBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 92,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: Colors.colorLight300,
  },
  amount: {
    flex: 7,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
    flex: 3,
    justifyContent: 'space-between',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  selectedItemImg: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    paddingHorizontal: 12,
    fontSize: FontSizes.fontSize32,
    fontWeight: '700',
    color: Colors.colorBlue500,
  },
  inputBottom: {
    paddingHorizontal: 12,
    fontSize: FontSizes.fontSize32,
    fontWeight: '700',
    color: Colors.colorBlack,
  },
  blueWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reverseBtnWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,

    position: 'absolute',
    left: 44,
    top: 80,
    zIndex: 100,
  },
  rateWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 18,
    borderRadius: 16,
    paddingTop: 2,
    backgroundColor: Colors.colorBlack,
    position: 'absolute',
    alignSelf: 'center',
    top: 83,
    zIndex: 100,
  },
  invalidWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  invalidText: {
    fontSize: FontSizes.fontSizeBase,
    fontWeight: '400',
    color: Colors.colorRedErr,
    marginLeft: 6,
  },
  title: {
    fontSize: FontSizes.fontSizeBase,
    fontWeight: '400',
    color: Colors.colorLight700,
  },
  rate: {
    flex: 1,
    fontSize: FontSizes.fontSizeXs,
    fontWeight: '700',
    color: Colors.colorWhite,
  },
  currencyTitle: {
    fontSize: FontSizes.fontSizeBase,
    color: Colors.colorBlack,
    fontWeight: '700',
    paddingRight: 4,
  },
  selectButtonIcon: {
    marginRight: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderColor: Colors.colorLight300,
    borderWidth: 1,
  },
  selectIconArrow: {
    width: 16,
    height: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  selectButton: {
    marginBottom: 12,
    width: 80,
    height: 24,
    paddingLeft: 0,
    paddingRight: 0,
  },
});

export default Calculator;
