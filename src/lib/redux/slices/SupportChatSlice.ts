import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MessageType } from '@/components/ui/SupportChat/SupportChat';
import { v4 as uuidv4 } from 'uuid';

interface SupportChatState {
  messages: MessageType[];
}

const initialState: SupportChatState = {
  messages: [
    {
      type: 'date',
      timestamp: new Date(),
      msgId: uuidv4(),
    },
  ],
};

const SupportChatSlice = createSlice({
  name: 'supportChat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<MessageType>) => {
      state.messages.push({
        ...action.payload,
      });
    },
  },
});

export const { addMessage } = SupportChatSlice.actions;
export default SupportChatSlice.reducer;
