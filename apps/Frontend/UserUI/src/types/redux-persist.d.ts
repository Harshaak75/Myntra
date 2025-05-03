// src/types/redux-persist.d.ts

import { PersistPartial } from 'redux-persist';

// Extend your store state type to include the _persist property
declare module 'redux-persist' {
  export interface PersistState {
    _persist: {
      version: number;
      rehydrated: boolean;
    };
  }
}

// Now extend your RootState (or wherever you define your store state type)
declare module './store/Store' {
  interface RootState {
    _persist: PersistState; // Adds the _persist property to the state type
  }
}
