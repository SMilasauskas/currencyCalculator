/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {ModalProvider} from 'react-native-modalfy';
import {stack} from './Modals/modalConfig';

import Calculator from './Components';

const App = () => {
  return (
    <ModalProvider stack={stack}>
      <Calculator />
    </ModalProvider>
  );
};

export default App;
