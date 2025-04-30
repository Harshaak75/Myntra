// store/index.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {sidebarReducer} from './SidebarSlice.tsx';
import { authReducer } from './authSlice.tsx';

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage


const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["email"], // Only persist the email
};


const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  auth: persistReducer(persistConfig, authReducer),
});

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

