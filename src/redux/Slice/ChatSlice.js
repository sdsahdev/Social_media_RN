import { createSlice } from '@reduxjs/toolkit';

const ChatSlice = createSlice({
  name: 'auth',
  initialState: {
    data: null,
  },
  reducers: {
    setChatList: (state, action) => {
      state.data = action.payload;
    },

  },
});

export const {setChatList, } = ChatSlice.actions;
export default ChatSlice.reducer;
