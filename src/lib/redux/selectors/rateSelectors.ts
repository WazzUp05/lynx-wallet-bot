import { RootState } from "../store";

const getRatesQuoteRub = (state: RootState) => state.rate.rate?.quote.RUB.price ?? null;

export { getRatesQuoteRub };
