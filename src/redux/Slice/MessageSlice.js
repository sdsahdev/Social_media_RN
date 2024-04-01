import {createSlice} from '@reduxjs/toolkit';

const MessageSlice = createSlice({
  name: 'auth',
  initialState: {
    NewMessageAlert: [
      {
        chatId: '',
        count: 0,
      },
    ],
  },
  reducers: {
    setNewMessageAlert: (state, action) => {
      const chatId = action.payload.chatId;
      const index = state.NewMessageAlert?.findIndex(
        item => item.chatId == chatId,
      );
      if (index !== -1) {
        state.NewMessageAlert[index].count += 1;
      } else {
        state.NewMessageAlert.push({
          chatId,
          count: 1,
        });
      }
    },
    removeNewMessage: (state, action) => {
      console.log(action.payload, '===action.playsik');
      state.NewMessageAlert = state.NewMessageAlert.filter(
        item => item.chatId != action.payload,
      );
      console.log(state.NewMessageAlert, '===new ====');
    },
  },
});

export const {setNewMessageAlert, removeNewMessage} = MessageSlice.actions;
export default MessageSlice.reducer;
