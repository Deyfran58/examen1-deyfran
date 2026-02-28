import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  categories: [],
  loading: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setProducts, setCategories, setLoading } = productSlice.actions;
export default productSlice.reducer;