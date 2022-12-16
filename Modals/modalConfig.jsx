import {Dimensions} from 'react-native';
import {
  createModalStack,
  ModalOptions,
  ModalStackConfig,
} from 'react-native-modalfy';
import {scaleHeight} from '../utils';
import Colors from '../styles/Colors';
import AssetsListComponent from './List';

const modalConfig = {
  AssetsListComponent: {
    disableFlingGesture: true,
    backdropColor: 'rgba(0,0,0,0.3)',
    modal: AssetsListComponent,
    containerStyle: {
      top: scaleHeight(100),
      backgroundColor: Colors.colorWhite,
      borderWidth: 1,
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      borderColor: 'transparent',
    },
    backdropOpacity: 0.1,
  },
};

const defaultOptions = {
  position: 'top',
  backdropColor: 'rgba(0,0,0, 0.7)',
  disableFlingGesture: true,
  containerStyle: {
    top: scaleHeight(270),
    backgroundColor: Colors.colorWhite,
    borderWidth: 1,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    borderColor: 'transparent',
  },
  transitionOptions: animatedValue => ({
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [0, 1, 2],
        }),
      },
    ],
  }),
};

export const stack = createModalStack(modalConfig, defaultOptions);
