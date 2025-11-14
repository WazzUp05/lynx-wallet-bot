import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const RATE_STORAGE_KEY = 'lynx_previous_rate';

export interface Rate {
    id: number;
    symbol: string;
    name: string;
    amount: number;
    last_updated: string;
    quote: {
        RUB: {
            price: number;
            percent_change_24h?: number;
            last_updated: string;
        };
    };
}

interface RateState {
    rates: Rate[];
}

const initialState: RateState = {
    rates: [],
};

// Функция для расчета процента изменения
const calculatePercentChange = (currentPrice: number, previousPrice: number): number => {
    if (!previousPrice || previousPrice === 0) return 0;
    return ((currentPrice - previousPrice) / previousPrice) * 100;
};

export const rateSlice = createSlice({
    name: 'rate',
    initialState,
    reducers: {
        setRates(state, action: PayloadAction<Rate[]>) {
            const newRates = action.payload;

            if (newRates.length > 0 && typeof window !== 'undefined') {
                const currentRate = newRates[0];
                const currentPrice = currentRate?.quote?.RUB?.price;

                if (currentPrice) {
                    // Получаем предыдущий курс из localStorage
                    const previousPriceStr = localStorage.getItem(RATE_STORAGE_KEY);
                    const previousPrice = previousPriceStr ? parseFloat(previousPriceStr) : null;

                    // Вычисляем процент изменения
                    if (previousPrice !== null) {
                        const percentChange = calculatePercentChange(currentPrice, previousPrice);
                        currentRate.quote.RUB.percent_change_24h = percentChange;
                    }

                    // Сохраняем текущий курс как предыдущий для следующего обновления
                    localStorage.setItem(RATE_STORAGE_KEY, currentPrice.toString());
                }
            }

            state.rates = newRates;
        },
    },
});

export const { setRates } = rateSlice.actions;
export default rateSlice.reducer;
