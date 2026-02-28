import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@fakeStore:cartItems';

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(item => item.id === product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);

      if (item) {
        item.quantity += 1;
      }

      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }

      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);

      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      AsyncStorage.removeItem(CART_STORAGE_KEY);
    },

    loadCart: (state, action) => {
      state.items = action.payload || [];
      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  loadCart,
} = cartSlice.actions;

export default cartSlice.reducer;