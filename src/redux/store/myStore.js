import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { default as AuthSlice } from "../Slice/AuthSlice";


let presistConfig ={
    key:'root',
    storage:AsyncStorage
}
let rootReducer = combineReducers({
    auth:AuthSlice
})

let presistedReducer = persistReducer(presistConfig, rootReducer)

const myStore = configureStore({
   reducer:  presistedReducer,
   middleware: (getDefaultMiddleware) =>
   getDefaultMiddleware({
     serializableCheck: false, // Disable serializable check
   }),
})
export default myStore;