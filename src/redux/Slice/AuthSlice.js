import {createSlice} from '@reduxjs/toolkit';

const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    data: null,
    token: null,
  },
  reducers: {
    setAuthdata: (state, action) => {
      state.data = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: state => {
      state.data = null;
    },
  },
});

export const {setAuthdata, logout, setToken} = AuthSlice.actions;
export default AuthSlice.reducer;
