import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}