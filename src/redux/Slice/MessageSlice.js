import {createSlice} from '@reduxjs/toolkit';

const MessageSlice = createSlice({
  name: 'auth',
  initialState: {
    data: null,
  },
  reducers: {
    setMessage: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const {setMessage} = MessageSlice.actions;
export default MessageSlice.reducer;
