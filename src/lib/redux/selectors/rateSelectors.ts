import { RootState } from '../store';

const getRatesQuoteRub = (state: RootState) => state.rate?.rates?.[0]?.quote?.RUB?.price ?? null;

const getRatesPercentChange24h = (state: RootState) =>
  state.rate?.rates?.[0]?.quote?.RUB?.percent_change_24h ?? null;

export { getRatesQuoteRub, getRatesPercentChange24h };
