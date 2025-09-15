import { RootState } from "../store";

const getRatesQuoteRub = (state: RootState) => state.rate?.rates?.[0]?.quote?.RUB?.price ?? null;

export { getRatesQuoteRub };
