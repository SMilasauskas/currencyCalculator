import {Platform, Dimensions, PixelRatio} from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

export const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} =
  Dimensions.get('window');
export const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} =
  Dimensions.get('screen');

/* height and width of iPhone 11; Figma */
export const BASE_HEIGHT = 812;
export const BASE_WIDTH = 375;

export const scaleHeight = size =>
  PixelRatio.roundToNearestPixel((WINDOW_HEIGHT / BASE_HEIGHT) * size);

export const scaleWidth = size =>
  PixelRatio.roundToNearestPixel((WINDOW_WIDTH / BASE_WIDTH) * size);

export const getDeviceType = () => {
  if (isIOS) return 'IOS';
  if (isAndroid) return 'ANDROID';
  return 'UNDEFINED'; //?
};
