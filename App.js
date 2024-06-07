import React, {useEffect} from 'react';
import {StyleSheet, Alert, Linking, BackHandler} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {Provider} from 'react-redux';
import MainNavigator from './src/navigation/MainNavigator';
import myStore from './src/redux/store/myStore';

import persistStore from 'redux-persist/es/persistStore';
import {PersistGate} from 'redux-persist/integration/react';
import {SocketProvide} from './src/socket/socket';
import VersionCheck from 'react-native-version-check';
let persister = persistStore(myStore);
const App = () => {
  useEffect(() => {
    if (!__DEV__) {
      checkUpdateNeeded();
    }
  }, []);
  const checkUpdateNeeded = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      if (updateNeeded && updateNeeded.isNeeded) {
        Alert.alert(
          'Please Update',
          'Please update the app to use the latest version.',
          [
            {
              text: 'Update',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl);
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {}
  };

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
