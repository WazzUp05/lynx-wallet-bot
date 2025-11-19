import { RootState } from '../store';

const getSupportChatMessages = (state: RootState) => state.supportChat.messages;

export { getSupportChatMessages };
