import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { MessageType } from "@/components/ui/SupportChat";
import { v4 as uuidv4 } from 'uuid';

interface SupportChatState {
    messages: MessageType[];
} 

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 2)

const initialState: SupportChatState = {
    messages: [
    {
        type: 'date',
        timestamp: yesterday,
    },
    {
        type: 'bot',
        text: 'Здравствуйте!',
        timestamp: new Date(),
        user: {
            id: uuidv4(),
            first_name: 'Линси',
        }
    },
    {
        type: 'bot',
        text: 'Что вас интересует? С удовольствием помогу найти информацию. Выберите кнопку снизу или напишите свой вопрос.',
        timestamp: new Date(),
        user: {
            id: uuidv4(),
            first_name: 'Линси',
        }
    },
    {
        type: 'buttons',
        timestamp: new Date(),
        buttons: [
        {    
            id: uuidv4(),
            text: 'Где мои деньги?'
        },
        {
            id: uuidv4(),
            text: 'Сколько ждать зачисление?'
        },
        {
            id: uuidv4(),
            text: 'Где я могу платить?'
        },
        {
            id: uuidv4(),
            text: 'Какая комиссия?'
        },
        {
            id: uuidv4(),
            text: 'Когда появится TON?'
        },
        ]
    }
],
};

const SupportChatSlice = createSlice({
    name: "supportChat",
    initialState,
    reducers: {
        addMessage:(state, action: PayloadAction<MessageType>) => {
            state.messages.push({
                ...action.payload
            });
        },
    }
});

export const { addMessage } = SupportChatSlice.actions
export default SupportChatSlice.reducer;