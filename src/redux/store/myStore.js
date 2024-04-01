import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import {default as AuthSlice} from '../Slice/AuthSlice';
import ChatSlice from '../Slice/ChatSlice';
import MessageSlice from '../Slice/MessageSlice';

let presistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
let rootReducer = combineReducers({
  auth: AuthSlice,
  chat: ChatSlice,
  message: MessageSlice,
});

let presistedReducer = persistReducer(presistConfig, rootReducer);

const myStore = configureStore({
  reducer: presistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false, // Disable serializable check
    }),
});
export default myStore;
