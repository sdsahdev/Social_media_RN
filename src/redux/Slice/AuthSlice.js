import { createSlice } from '@reduxjs/toolkit';

const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    data: null,
  },
  reducers: {
    setAuthdata: (state, action) => {
      state.data = action.payload;
    },
    logout: state => {
      state.data = null;
    },
  },
});

export const {setAuthdata, logout} = AuthSlice.actions;
export default AuthSlice.reducer;
