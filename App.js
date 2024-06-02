import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {Provider} from 'react-redux';
import MainNavigator from './src/navigation/MainNavigator';
import myStore from './src/redux/store/myStore';

import persistStore from 'redux-persist/es/persistStore';
import {PersistGate} from 'redux-persist/integration/react';
import {SocketProvide} from './src/socket/socket';
let persister = persistStore(myStore);
import branch from 'react-native-branch';

const App = () => {
  const animastion = useSharedValue(0);
  return (
    <Provider store={myStore}>
      <PersistGate persistor={persister}>
        <SocketProvide>
          <MainNavigator />
        </SocketProvide>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
